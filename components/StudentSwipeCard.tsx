import { View, Text, Dimensions } from 'react-native';
import { Profile } from '../types/supabase';
import { User, GraduationCap, Building2, BookOpen } from 'lucide-react-native';
import { AvatarPreview, AvatarConfig } from './AvatarBuilder';

interface StudentSwipeCardProps {
    student: Profile;
    courseCode: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function StudentSwipeCard({ student, courseCode }: StudentSwipeCardProps) {
    const avatarConfig = student.avatar_config as AvatarConfig | null;

    return (
        <View
            className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 w-full h-full"
            style={{
                elevation: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
            }}
        >
            {/* Avatar Section */}
            <View
                className="bg-gradient-to-b from-blue-50 to-blue-100 items-center justify-center"
                style={{ height: SCREEN_HEIGHT * 0.35 }}
            >
                <View className="bg-white rounded-full p-2 shadow-lg">
                    {avatarConfig ? (
                        <View className="w-40 h-40 rounded-full overflow-hidden">
                            <AvatarPreview config={avatarConfig} size={160} />
                        </View>
                    ) : student.avatar_url ? (
                        <View className="w-40 h-40 bg-gray-200 rounded-full" />
                    ) : (
                        <View className="w-40 h-40 bg-gray-100 rounded-full items-center justify-center">
                            <User size={64} color="#9CA3AF" />
                        </View>
                    )}
                </View>

                {/* Course badge */}
                <View className="absolute top-4 right-4 bg-blue-500/90 px-3 py-1.5 rounded-full shadow-sm">
                    <Text className="text-white font-bold text-xs uppercase">
                        Interested in {courseCode}
                    </Text>
                </View>
            </View>

            {/* Info Section */}
            <View className="p-6 flex-1 justify-between bg-white">
                <View>
                    <Text className="text-2xl font-black text-gray-900 mb-1 leading-tight text-center">
                        {student.full_name || 'Student'}
                    </Text>

                    <Text className="text-gray-400 text-center mb-6">
                        {student.email}
                    </Text>

                    <View className="space-y-3">
                        {student.department && (
                            <View className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex-row items-center">
                                <View className="bg-white p-2 rounded-xl mr-3">
                                    <BookOpen size={18} color="#3b82f6" />
                                </View>
                                <View>
                                    <Text className="text-gray-400 text-xs font-bold uppercase">Department</Text>
                                    <Text className="text-gray-800 font-semibold">{student.department}</Text>
                                </View>
                            </View>
                        )}

                        {student.faculty && (
                            <View className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex-row items-center mt-3">
                                <View className="bg-white p-2 rounded-xl mr-3">
                                    <Building2 size={18} color="#3b82f6" />
                                </View>
                                <View>
                                    <Text className="text-gray-400 text-xs font-bold uppercase">Faculty</Text>
                                    <Text className="text-gray-800 font-semibold">{student.faculty}</Text>
                                </View>
                            </View>
                        )}

                        {student.term && (
                            <View className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex-row items-center mt-3">
                                <View className="bg-white p-2 rounded-xl mr-3">
                                    <GraduationCap size={18} color="#3b82f6" />
                                </View>
                                <View>
                                    <Text className="text-gray-400 text-xs font-bold uppercase">Term</Text>
                                    <Text className="text-gray-800 font-semibold">Term {student.term}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                <View className="flex-row items-center justify-center border-t border-gray-100 pt-4 mt-4">
                    <GraduationCap size={16} color="#9CA3AF" />
                    <Text className="text-gray-400 text-xs font-semibold ml-1 uppercase">Student Profile</Text>
                </View>
            </View>
        </View>
    );
}
