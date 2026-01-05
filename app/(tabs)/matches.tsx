import { useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/supabase";
import { MessageCircle } from "lucide-react-native";

type MatchWithCourse = Database["public"]["Tables"]["matches"]["Row"] & {
    courses: Database["public"]["Tables"]["courses"]["Row"]
};

export default function Matches() {
    const [matches, setMatches] = useState<MatchWithCourse[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    async function fetchMatches() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from("matches")
            .select("*, courses(*)")
            .eq("user_id", user.id)
            .neq("status", "rejected")
            .order("created_at", { ascending: false });

        if (error) console.error(error);
        if (data) setMatches(data as any);
    }

    useEffect(() => {
        fetchMatches();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchMatches();
        setRefreshing(false);
    };

    const handleMatchPress = (match: MatchWithCourse) => {
        if (match.status === "matched") {
            router.push({
                pathname: "/chat",
                params: { matchId: match.id.toString(), courseCode: match.courses.code }
            });
        }
    };

    const renderItem = ({ item }: { item: MatchWithCourse }) => (
        <TouchableOpacity
            onPress={() => handleMatchPress(item)}
            activeOpacity={item.status === "matched" ? 0.7 : 1}
            className="flex-row items-center bg-white p-4 mb-3 mx-4 rounded-xl shadow-sm"
        >
            <Image
                source={{ uri: item.courses.image_url || "https://via.placeholder.com/100" }}
                className="w-16 h-16 rounded-full mr-4"
            />
            <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">{item.courses.code}</Text>
                <Text className="text-sm text-gray-500">{item.courses.title}</Text>
                <Text className={`text-xs mt-1 font-bold ${item.status === "matched" ? "text-green-600" : "text-orange-500"
                    }`}>
                    {item.status?.toUpperCase()}
                </Text>
            </View>
            {item.status === "matched" && (
                <View className="bg-pink-100 p-2 rounded-full">
                    <MessageCircle size={20} color="#ec4899" />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="flex-1 w-full max-w-2xl mx-auto">
                <Text className="text-3xl font-bold text-pink-500 px-6 py-4">Matches</Text>
                <FlatList
                    data={matches}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={
                        <View className="items-center justify-center mt-20">
                            <Text className="text-gray-400">No matches yet. Keep swiping!</Text>
                        </View>
                    }
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </View>
        </SafeAreaView>
    );
}

