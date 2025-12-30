import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Home() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-3xl font-bold text-pink-500 mb-4">Love Drop</Text>
            <Text className="text-gray-500 mb-8">Course Matching Experiment</Text>

            <Link href="/(auth)/login" asChild>
                <TouchableOpacity className="bg-pink-500 px-6 py-3 rounded-full">
                    <Text className="text-white font-semibold">Get Started</Text>
                </TouchableOpacity>
            </Link>

            <StatusBar style="auto" />
        </View>
    );
}
