import { Tabs } from 'expo-router';
import { BookOpen, MessageCircle, Settings as SettingsIcon } from 'lucide-react-native';

export default function TeacherLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#3b82f6', headerShown: false }}>
            <Tabs.Screen
                name="courses"
                options={{
                    title: 'My Courses',
                    tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="chats"
                options={{
                    title: 'Messages',
                    tabBarIcon: ({ color }) => <MessageCircle size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <SettingsIcon size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
