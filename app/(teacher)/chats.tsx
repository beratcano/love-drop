import { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Profile, Match, Message } from "../../types/supabase";
import { MessageCircle, User, ChevronRight, ArrowLeft } from "lucide-react-native";
import { AvatarPreview, AvatarConfig } from "../../components/AvatarBuilder";

type ChatPreview = {
    match_id: number;
    student: Profile;
    course_code: string;
    course_id: string;
    last_message?: Message;
    unread_count: number;
};

export default function TeacherChats() {
    const { courseId, courseCode } = useLocalSearchParams<{ courseId?: string; courseCode?: string }>();
    const [chats, setChats] = useState<ChatPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<{ id: string; code: string } | null>(
        courseId && courseCode ? { id: courseId, code: courseCode } : null
    );
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            fetchChats();
        }, [selectedCourse])
    );

    async function fetchChats() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.replace("/(auth)/login");
                return;
            }

            // Get teacher's courses
            let coursesQuery = supabase
                .from("courses")
                .select("id, code")
                .eq("instructor_id", user.id);

            if (selectedCourse) {
                coursesQuery = coursesQuery.eq("id", selectedCourse.id);
            }

            const { data: courses } = await coursesQuery;

            if (!courses || courses.length === 0) {
                setChats([]);
                setLoading(false);
                return;
            }

            const courseIds = courses.map(c => c.id);
            const courseMap = Object.fromEntries(courses.map(c => [c.id, c.code]));

            // Get all matches for teacher's courses
            const { data: matches } = await supabase
                .from("matches")
                .select("id, user_id, course_id, status")
                .in("course_id", courseIds)
                .eq("status", "matched");

            if (!matches || matches.length === 0) {
                setChats([]);
                setLoading(false);
                return;
            }

            // Get student profiles
            const studentIds = [...new Set(matches.map(m => m.user_id))];
            const { data: students } = await supabase
                .from("profiles")
                .select("*")
                .in("id", studentIds);

            const studentMap = Object.fromEntries((students || []).map(s => [s.id, s]));

            // Get last messages for each match
            const matchIds = matches.map(m => m.id);
            const { data: messages } = await supabase
                .from("messages")
                .select("*")
                .in("match_id", matchIds)
                .order("created_at", { ascending: false });

            // Group messages by match_id and get the latest
            const lastMessageMap: Record<number, Message> = {};
            (messages || []).forEach(msg => {
                if (!lastMessageMap[msg.match_id]) {
                    lastMessageMap[msg.match_id] = msg;
                }
            });

            // Build chat previews
            const chatPreviews: ChatPreview[] = matches.map(match => ({
                match_id: match.id,
                student: studentMap[match.user_id] || { id: match.user_id, full_name: "Unknown Student" } as Profile,
                course_code: courseMap[match.course_id] || "",
                course_id: match.course_id,
                last_message: lastMessageMap[match.id],
                unread_count: 0, // Could implement read tracking later
            }));

            // Sort by last message date
            chatPreviews.sort((a, b) => {
                const aTime = a.last_message?.created_at || "0";
                const bTime = b.last_message?.created_at || "0";
                return bTime.localeCompare(aTime);
            });

            setChats(chatPreviews);
        } catch (error) {
            console.error("Error fetching chats:", error);
        } finally {
            setLoading(false);
        }
    }

    const renderChat = ({ item }: { item: ChatPreview }) => {
        const avatarConfig = item.student.avatar_config as AvatarConfig | null;

        return (
            <TouchableOpacity
                className="bg-white rounded-2xl mb-3 p-4 flex-row items-center shadow-sm border border-gray-100"
                onPress={() => router.push({
                    pathname: "/teacher-chat",
                    params: {
                        matchId: item.match_id.toString(),
                        courseCode: item.course_code,
                        studentName: item.student.full_name || "Student"
                    }
                })}
                activeOpacity={0.7}
            >
                <View className="w-14 h-14 bg-gray-100 rounded-full items-center justify-center overflow-hidden mr-4">
                    {avatarConfig ? (
                        <AvatarPreview config={avatarConfig} size={56} />
                    ) : item.student.avatar_url ? (
                        <View className="w-14 h-14 bg-gray-200 rounded-full" />
                    ) : (
                        <User size={28} color="#9CA3AF" />
                    )}
                </View>

                <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-base font-bold text-gray-900">
                            {item.student.full_name || "Student"}
                        </Text>
                        <View className="bg-blue-100 px-2 py-0.5 rounded-full">
                            <Text className="text-blue-600 font-bold text-xs">{item.course_code}</Text>
                        </View>
                    </View>
                    <Text className="text-gray-500 text-sm" numberOfLines={1}>
                        {item.last_message?.content || "No messages yet"}
                    </Text>
                    {item.last_message && (
                        <Text className="text-gray-300 text-xs mt-1">
                            {new Date(item.last_message.created_at || "").toLocaleDateString()}
                        </Text>
                    )}
                </View>

                <ChevronRight size={20} color="#D1D5DB" />
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="px-6 py-4 bg-white border-b border-gray-100">
                {selectedCourse && (
                    <TouchableOpacity
                        className="flex-row items-center mb-2"
                        onPress={() => {
                            setSelectedCourse(null);
                            router.setParams({ courseId: "", courseCode: "" });
                        }}
                    >
                        <ArrowLeft size={16} color="#6B7280" />
                        <Text className="text-gray-500 text-sm ml-1">All Courses</Text>
                    </TouchableOpacity>
                )}
                <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">
                    {selectedCourse ? selectedCourse.code : "All Courses"}
                </Text>
                <Text className="text-3xl font-bold text-gray-900">
                    Student Messages
                </Text>
            </View>

            {chats.length === 0 ? (
                <View className="flex-1 items-center justify-center p-8">
                    <MessageCircle size={48} color="#D1D5DB" />
                    <Text className="text-gray-400 text-center font-medium text-lg mt-4 mb-2">
                        No messages yet
                    </Text>
                    <Text className="text-gray-300 text-center text-sm">
                        Students who match with your courses will appear here.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item.match_id.toString()}
                    renderItem={renderChat}
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}
