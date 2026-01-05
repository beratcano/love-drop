import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";
import { Save, ArrowLeft } from "lucide-react-native";

interface ProfileData {
    full_name: string;
    department: string;
    faculty: string;
    term: string;
}

export default function Settings() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<ProfileData>({
        full_name: "",
        department: "",
        faculty: "",
        term: ""
    });

    useEffect(() => {
        fetchProfile();
    }, []);

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
                .select("full_name, department, faculty, term")
                .eq("id", user.id)
                .single();

            if (data) {
                setProfile({
                    full_name: data.full_name || "",
                    department: data.department || "",
                    faculty: data.faculty || "",
                    term: data.term || ""
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    }

    async function saveProfile() {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: profile.full_name,
                    department: profile.department,
                    faculty: profile.faculty,
                    term: profile.term,
                    updated_at: new Date().toISOString()
                })
                .eq("id", user.id);

            if (error) {
                throw error;
            }

            if (Platform.OS !== "web") {
                Alert.alert("Success", "Profile updated!");
            } else {
                alert("Profile updated!");
            }
        } catch (error: any) {
            console.error("Error saving profile:", error);
            if (Platform.OS !== "web") {
                Alert.alert("Error", error.message || "Failed to save profile");
            } else {
                alert("Error: " + (error.message || "Failed to save profile"));
            }
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator color="#ec4899" size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <View className="flex-row items-center mb-8">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mr-4 p-2"
                    >
                        <ArrowLeft size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text className="text-3xl font-bold text-gray-900">Settings</Text>
                </View>

                <Text className="text-gray-400 font-bold uppercase text-xs mb-6 tracking-widest">
                    Edit Profile
                </Text>

                <View className="mb-6">
                    <Text className="text-gray-600 font-semibold mb-2">Full Name</Text>
                    <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-gray-900 text-base"
                        value={profile.full_name}
                        onChangeText={(text) => setProfile({ ...profile, full_name: text })}
                        placeholder="Enter your full name"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-gray-600 font-semibold mb-2">Department</Text>
                    <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-gray-900 text-base"
                        value={profile.department}
                        onChangeText={(text) => setProfile({ ...profile, department: text })}
                        placeholder="e.g. Computer Engineering"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View className="mb-6">
                    <Text className="text-gray-600 font-semibold mb-2">Faculty</Text>
                    <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-gray-900 text-base"
                        value={profile.faculty}
                        onChangeText={(text) => setProfile({ ...profile, faculty: text })}
                        placeholder="e.g. Engineering Faculty"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View className="mb-8">
                    <Text className="text-gray-600 font-semibold mb-2">Term / Year</Text>
                    <TextInput
                        className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 text-gray-900 text-base"
                        value={profile.term}
                        onChangeText={(text) => setProfile({ ...profile, term: text })}
                        placeholder="e.g. 3rd Year"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <TouchableOpacity
                    className="bg-pink-500 py-4 rounded-2xl items-center flex-row justify-center gap-2 shadow-lg shadow-pink-200"
                    onPress={saveProfile}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Save size={20} color="white" />
                            <Text className="text-white font-bold text-lg">Save Changes</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
