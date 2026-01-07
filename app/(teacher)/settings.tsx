import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { LogOut, User, ChevronRight } from "lucide-react-native";

export default function TeacherSettings() {
    const router = useRouter();

    async function handleLogout() {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await supabase.auth.signOut();
                        router.replace("/(auth)/login");
                    }
                }
            ]
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="px-6 py-4 bg-white border-b border-gray-100">
                <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">
                    Teacher Portal
                </Text>
                <Text className="text-3xl font-bold text-gray-900">
                    Settings
                </Text>
            </View>

            <View className="p-4">
                <View className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <TouchableOpacity
                        className="flex-row items-center p-4 border-b border-gray-100"
                        onPress={() => {/* Navigate to profile edit */}}
                    >
                        <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
                            <User size={20} color="#3b82f6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-900 font-semibold">Edit Profile</Text>
                            <Text className="text-gray-400 text-sm">Update your information</Text>
                        </View>
                        <ChevronRight size={20} color="#D1D5DB" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center p-4"
                        onPress={handleLogout}
                    >
                        <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-4">
                            <LogOut size={20} color="#ef4444" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-red-500 font-semibold">Logout</Text>
                            <Text className="text-gray-400 text-sm">Sign out of your account</Text>
                        </View>
                        <ChevronRight size={20} color="#D1D5DB" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
