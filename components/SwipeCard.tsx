import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Course, formatSchedule } from '../types/supabase';
import { Clock, BookOpen, GraduationCap, Info } from 'lucide-react-native';

interface SwipeCardProps {
    course: Course;
    onPress?: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SwipeCard({ course, onPress }: SwipeCardProps) {
    const credits = course.credits || 3;
    const isElective = course.is_elective;

    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={onPress}
            style={{ flex: 1 }}
        >
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
                <View className="relative">
                    <Image
                        source={{ uri: course.image_url || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800' }}
                        className="w-full"
                        style={{ height: SCREEN_HEIGHT * 0.35 }}
                        resizeMode="cover"
                    />
                    {/* Top badges row */}
                    <View className="absolute top-4 left-4 right-4 flex-row flex-wrap gap-2">
                        {/* Course code */}
                        <View className="bg-white/90 px-3 py-1.5 rounded-full shadow-sm">
                            <Text className="text-pink-600 font-bold text-xs tracking-wider uppercase">{course.code}</Text>
                        </View>

                        {/* Required/Elective badge */}
                        <View className={`px-3 py-1.5 rounded-full shadow-sm ${isElective ? "bg-blue-500/90" : "bg-green-500/90"}`}>
                            <Text className="text-white font-bold text-xs uppercase">
                                {isElective ? "Elective" : "Required"}
                            </Text>
                        </View>

                        {/* Credits badge */}
                        <View className="bg-purple-500/90 px-3 py-1.5 rounded-full shadow-sm">
                            <Text className="text-white font-bold text-xs uppercase">
                                {credits} {credits === 1 ? "Credit" : "Credits"}
                            </Text>
                        </View>
                    </View>

                    {/* Match probability */}
                    <View className="absolute bottom-4 right-4 bg-green-500 px-3 py-1.5 rounded-full shadow-lg">
                        <Text className="text-white font-bold text-xs">{Math.round((course.match_probability || 0) * 100)}% Match</Text>
                    </View>
                </View>

                <View className="p-6 flex-1 justify-between bg-white">
                    <View>
                        <Text className="text-2xl font-black text-gray-900 mb-2 leading-tight" numberOfLines={2}>
                            {course.title}
                        </Text>

                        <View className="bg-gray-50 p-4 rounded-2xl mb-4 border border-gray-100">
                            <View className="flex-row items-center mb-2">
                                <Clock size={16} color="#ec4899" />
                                <Text className="text-pink-500 font-bold text-xs ml-2 uppercase tracking-tight">Schedule</Text>
                            </View>
                            <Text className="text-gray-800 font-medium">
                                {formatSchedule(course)}
                            </Text>
                        </View>

                        <View className="flex-row items-center opacity-60">
                            <Info size={16} color="#6B7280" />
                            <Text className="text-gray-500 text-sm ml-2 font-medium" numberOfLines={3}>
                                {course.description || 'No description provided for this course.'}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-between border-t border-gray-100 pt-4">
                        <View className="flex-row items-center">
                            <BookOpen size={16} color="#9CA3AF" />
                            <Text className="text-gray-400 text-xs font-semibold ml-1 uppercase">Course Entry</Text>
                        </View>
                        <GraduationCap size={20} color="#E5E7EB" />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}