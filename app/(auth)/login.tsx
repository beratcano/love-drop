import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            router.replace('/(tabs)/home');
        }
        setLoading(false);
    }

    async function signUpWithEmail() {
        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: email.split('@')[0],
                    role: 'student'
                }
            }
        });

        if (error) {
            Alert.alert('Error', error.message);
        } else if (!data.session) {
            Alert.alert('Please check your inbox for email verification!');
        } else {
            router.replace('/(tabs)/home');
        }
        setLoading(false);
    }

    async function directLogin(isTeacher = false) {
        const testEmail = isTeacher ? 'teacher@lovedrop.com' : 'tester@lovedrop.com';
        const testPassword = 'password123';

        setLoading(true);
        try {
            // 1. Try to sign in
            let { data, error } = await supabase.auth.signInWithPassword({
                email: testEmail,
                password: testPassword,
            });

            // 2. If it fails with invalid credentials, try to sign up
            if (error && error.message === 'Invalid login credentials') {
                const { error: signUpError } = await supabase.auth.signUp({
                    email: testEmail,
                    password: testPassword,
                    options: {
                        data: {
                            full_name: isTeacher ? 'Dr. Test Teacher' : 'Test User',
                            is_student: !isTeacher
                        }
                    }
                });

                if (signUpError) throw signUpError;

                // Try to sign in again after registration
                const res = await supabase.auth.signInWithPassword({
                    email: testEmail,
                    password: testPassword,
                });
                data = res.data;
                error = res.error;
            }

            if (error) {
                Alert.alert('Error', error.message);
            } else if (data.session) {
                const userId = data.session.user.id;

                // Update profile with is_student flag if needed
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('is_student')
                    .eq('id', userId)
                    .single();

                if (profile && profile.is_student !== !isTeacher) {
                    await supabase
                        .from('profiles')
                        .update({ is_student: !isTeacher, full_name: isTeacher ? 'Dr. Test Teacher' : 'Test User' })
                        .eq('id', userId);
                }

                // For teacher: assign all courses to them if they don't have any
                if (isTeacher) {
                    const { data: teacherCourses } = await supabase
                        .from('courses')
                        .select('id')
                        .eq('instructor_id', userId);

                    if (!teacherCourses || teacherCourses.length === 0) {
                        // Assign all courses to this teacher for testing
                        await supabase
                            .from('courses')
                            .update({ instructor_id: userId })
                            .is('instructor_id', null);
                    }
                }

                router.replace(isTeacher ? '/(teacher)/courses' : '/(tabs)/home');
            } else {
                Alert.alert('Verification Required', 'Test user created. Please try clicking again in a few seconds.');
            }
        } catch (err: any) {
            Alert.alert('Unexpected Error', err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 justify-center px-8 bg-white">
            <View className="w-full max-w-md mx-auto">
                <View className="items-center mb-10">
                    <Text className="text-4xl font-bold text-pink-500">Love Drop</Text>
                    <Text className="text-gray-500 mt-2">Login or Sign Up to start matching</Text>
                </View>

                <View className="space-y-4">
                    <TextInput
                        className="border border-gray-300 rounded-lg p-4 text-base"
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        placeholder="email@address.com"
                        autoCapitalize="none"
                    />
                    <TextInput
                        className="border border-gray-300 rounded-lg p-4 text-base mt-4"
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        placeholder="Password"
                        secureTextEntry={true}
                        autoCapitalize="none"
                    />
                </View>

                <View className="mt-8 gap-4">
                    <TouchableOpacity
                        className="bg-pink-500 py-4 rounded-xl items-center"
                        onPress={signInWithEmail}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Sign In</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-pink-100 py-4 rounded-xl items-center border border-pink-200"
                        onPress={() => directLogin(false)}
                        disabled={loading}
                    >
                        <Text className="text-pink-700 font-bold text-lg">Student Login (Test)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-blue-100 py-4 rounded-xl items-center border border-blue-200"
                        onPress={() => directLogin(true)}
                        disabled={loading}
                    >
                        <Text className="text-blue-700 font-bold text-lg">Teacher Login (Test)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-gray-100 py-4 rounded-xl items-center"
                        onPress={signUpWithEmail}
                        disabled={loading}
                    >
                        <Text className="text-gray-700 font-bold text-lg">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
