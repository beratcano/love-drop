import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";
import { LogOut, GraduationCap, School, Calendar, Heart, Layers, Pencil } from "lucide-react-native";
import AvatarBuilder, { AvatarPreview, AvatarConfig, defaultAvatarConfig } from "../../components/AvatarBuilder";

interface ProfileData {
    full_name: string | null;
    department: string | null;
    faculty: string | null;
    term: string | null;
    avatar_config: AvatarConfig | null;
}

export default function Profile() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [stats, setStats] = useState({ matches: 0, swipes: 0 });
    const [avatarBuilderVisible, setAvatarBuilderVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [])
    );

    async function fetchProfile() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.replace("/(auth)/login");
                return;
            }

            const { data, error } = await supabase
                .from("profiles")
                .select("full_name, department, faculty, term, avatar_config")
                .eq("id", user.id)
                .single();

            if (data) {
                setProfile({
                    ...data,
                    avatar_config: data.avatar_config ? (typeof data.avatar_config === "string" ? JSON.parse(data.avatar_config) : data.avatar_config) : null
                });
            }

            const { count: matchCount } = await supabase
                .from("matches")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user.id)
                .eq("status", "matched");

            const { count: swipeCount } = await supabase
                .from("matches")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user.id);

            setStats({
                matches: matchCount || 0,
                swipes: swipeCount || 0
            });

        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    }

    async function saveAvatar(config: AvatarConfig) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase
                .from("profiles")
                .update({ avatar_config: config })
                .eq("id", user.id);

            setProfile(prev => prev ? { ...prev, avatar_config: config } : null);
        } catch (error) {
            console.error("Error saving avatar:", error);
        }
    }

    async function signOut() {
        await supabase.auth.signOut();
        router.replace("/(auth)/login");
    }

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator color="#ec4899" size="large" />
            </View>
        );
    }

    const avatarConfig = profile?.avatar_config || defaultAvatarConfig;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <View className="items-center mt-4 mb-8">
                    <TouchableOpacity
                        onPress={() => setAvatarBuilderVisible(true)}
                        className="relative"
                    >
                        <View className="w-28 h-28 bg-pink-50 rounded-full items-center justify-center mb-4 border-4 border-pink-100 shadow-sm overflow-hidden">
                            <AvatarPreview config={avatarConfig} size={100} />
                        </View>
                        <View className="absolute bottom-3 right-0 bg-pink-500 p-2 rounded-full shadow-lg">
                            <Pencil size={14} color="white" />
                        </View>
                    </TouchableOpacity>
                    <Text className="text-3xl font-bold text-gray-900">{profile?.full_name || "Student"}</Text>
                    <Text className="text-pink-500 font-semibold text-lg mt-1">Verified Scholar</Text>
                </View>

                <View className="flex-row justify-between mb-8 gap-4">
                    <View className="flex-1 bg-pink-50 p-4 rounded-3xl items-center border border-pink-100 shadow-sm">
                        <Heart size={24} color="#ec4899" fill="#ec4899" />
                        <Text className="text-2xl font-bold text-gray-900 mt-1">{stats.matches}</Text>
                        <Text className="text-gray-500 text-xs font-bold uppercase tracking-tight">Matches</Text>
                    </View>
                    <View className="flex-1 bg-pink-50 p-4 rounded-3xl items-center border border-pink-100 shadow-sm">
                        <Layers size={24} color="#ec4899" />
                        <Text className="text-2xl font-bold text-gray-900 mt-1">{stats.swipes}</Text>
                        <Text className="text-gray-500 text-xs font-bold uppercase tracking-tight">Swipes</Text>
                    </View>
                </View>

                <View className="bg-gray-50 rounded-[32px] p-6 mb-8 border border-gray-100">
                    <Text className="text-gray-400 font-bold uppercase text-xs mb-6 tracking-widest">Academic Credentials</Text>

                    <View className="space-y-6">
                        <View className="flex-row items-center gap-4 mb-6">
                            <View className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                                <GraduationCap size={20} color="#ec4899" />
                            </View>
                            <View>
                                <Text className="text-gray-400 text-xs font-bold uppercase">Department</Text>
                                <Text className="text-gray-800 font-bold text-base">{profile?.department || "Not specified"}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center gap-4 mb-6">
                            <View className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                                <School size={20} color="#ec4899" />
                            </View>
                            <View>
                                <Text className="text-gray-400 text-xs font-bold uppercase">Faculty</Text>
                                <Text className="text-gray-800 font-bold text-base">{profile?.faculty || "Not specified"}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center gap-4">
                            <View className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                                <Calendar size={20} color="#ec4899" />
                            </View>
                            <View>
                                <Text className="text-gray-400 text-xs font-bold uppercase">Term / Year</Text>
                                <Text className="text-gray-800 font-bold text-base">{profile?.term || "Not specified"}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-white py-4 rounded-2xl items-center border border-gray-200 shadow-sm flex-row justify-center gap-2 mb-10"
                    onPress={signOut}
                >
                    <LogOut size={20} color="#ef4444" />
                    <Text className="text-red-500 font-bold text-lg">Sign Out</Text>
                </TouchableOpacity>
            </ScrollView>

            <AvatarBuilder
                visible={avatarBuilderVisible}
                onClose={() => setAvatarBuilderVisible(false)}
                onSave={saveAvatar}
                initialConfig={avatarConfig}
            />
        </SafeAreaView>
    );
}

