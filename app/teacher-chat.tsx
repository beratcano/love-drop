import { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../lib/supabase";
import { Message } from "../types/supabase";
import { ArrowLeft, Send } from "lucide-react-native";
import { RealtimeChannel } from "@supabase/supabase-js";

export default function TeacherChat() {
    const { matchId, courseCode, studentName } = useLocalSearchParams<{
        matchId: string;
        courseCode: string;
        studentName: string;
    }>();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const flatListRef = useRef<FlatList>(null);
    const channelRef = useRef<RealtimeChannel | null>(null);

    useEffect(() => {
        initChat();

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
            }
        };
    }, [matchId]);

    async function initChat() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.replace("/(auth)/login");
            return;
        }
        setUserId(user.id);

        await fetchMessages();
        subscribeToMessages();
        setLoading(false);
    }

    async function fetchMessages() {
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("match_id", parseInt(matchId || "0"))
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching messages:", error);
        } else if (data) {
            setMessages(data);
        }
    }

    function subscribeToMessages() {
        const channel = supabase
            .channel(`teacher-messages:${matchId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `match_id=eq.${matchId}`,
                },
                (payload) => {
                    const newMsg = payload.new as Message;
                    setMessages((prev) => [...prev, newMsg]);
                }
            )
            .subscribe();

        channelRef.current = channel;
    }

    async function sendMessage() {
        if (!newMessage.trim() || !userId || sending) return;

        setSending(true);
        const { error } = await supabase.from("messages").insert({
            match_id: parseInt(matchId || "0"),
            sender_id: userId,
            content: newMessage.trim(),
        });

        if (error) {
            console.error("Error sending message:", error);
        } else {
            setNewMessage("");
        }
        setSending(false);
    }

    const renderMessage = ({ item }: { item: Message }) => {
        const isMe = item.sender_id === userId;

        return (
            <View
                className={`max-w-[75%] p-3 rounded-2xl mb-2 ${isMe
                    ? "bg-blue-500 self-end rounded-br-none"
                    : "bg-white self-start rounded-bl-none shadow-sm"
                    }`}
            >
                <Text className={isMe ? "text-white" : "text-gray-800"}>
                    {item.content}
                </Text>
                <Text
                    className={`text-xs mt-1 ${isMe ? "text-blue-200" : "text-gray-400"
                        }`}
                >
                    {new Date(item.created_at || "").toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </Text>
            </View>
        );
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="p-2 mr-2"
                    >
                        <ArrowLeft size={24} color="#374151" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-900">
                            {studentName || "Student"}
                        </Text>
                        <View className="flex-row items-center">
                            <View className="bg-blue-100 px-2 py-0.5 rounded-full mr-2">
                                <Text className="text-blue-600 font-bold text-xs">{courseCode}</Text>
                            </View>
                            <Text className="text-xs text-gray-400">Student Chat</Text>
                        </View>
                    </View>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMessage}
                    contentContainerStyle={{
                        padding: 16,
                        flexGrow: 1,
                        justifyContent: messages.length === 0 ? "center" : "flex-end",
                    }}
                    onContentSizeChange={() =>
                        flatListRef.current?.scrollToEnd({ animated: true })
                    }
                    ListEmptyComponent={
                        <View className="items-center">
                            <Text className="text-gray-400 text-center">
                                No messages yet.{"\n"}Start the conversation with your student!
                            </Text>
                        </View>
                    }
                />

                <View className="flex-row items-center px-4 py-3 bg-white border-t border-gray-100">
                    <TextInput
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-100 rounded-full px-4 py-3 mr-3"
                        onSubmitEditing={sendMessage}
                        returnKeyType="send"
                    />
                    <TouchableOpacity
                        onPress={sendMessage}
                        disabled={!newMessage.trim() || sending}
                        className={`p-3 rounded-full ${newMessage.trim() && !sending
                            ? "bg-blue-500"
                            : "bg-gray-200"
                            }`}
                    >
                        <Send
                            size={20}
                            color={newMessage.trim() && !sending ? "white" : "#9CA3AF"}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
