import { View, Text, Modal, TouchableOpacity, ScrollView, Image, Dimensions } from "react-native";
import { Database } from "../types/supabase";
import { X, Clock, User, BookOpen, GraduationCap, Calendar, Info, CheckCircle } from "lucide-react-native";

type Course = Database["public"]["Tables"]["courses"]["Row"];

interface CourseDetailsModalProps {
    course: Course | null;
    visible: boolean;
    onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function CourseDetailsModal({ course, visible, onClose }: CourseDetailsModalProps) {
    if (!course) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-white">
                <View className="relative">
                    <Image
                        source={{ uri: course.image_url || "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800" }}
                        className="w-full"
                        style={{ height: SCREEN_HEIGHT * 0.3 }}
                        resizeMode="cover"
                    />
                    <TouchableOpacity
                        onPress={onClose}
                        className="absolute top-12 right-4 bg-white/90 p-3 rounded-full shadow-lg"
                    >
                        <X size={24} color="#374151" />
                    </TouchableOpacity>
                    <View className="absolute bottom-4 left-4 flex-row gap-2">
                        <View className="bg-white/90 px-4 py-2 rounded-full shadow-sm">
                            <Text className="text-pink-600 font-bold text-sm tracking-wider uppercase">{course.code}</Text>
                        </View>
                        {course.is_elective && (
                            <View className="bg-blue-500/90 px-4 py-2 rounded-full shadow-sm">
                                <Text className="text-white font-bold text-sm uppercase">Elective</Text>
                            </View>
                        )}
                    </View>
                </View>

                <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
                    <Text className="text-3xl font-black text-gray-900 mb-2 leading-tight">
                        {course.title}
                    </Text>

                    <View className="flex-row items-center mb-6">
                        <View className="bg-green-100 px-4 py-2 rounded-full flex-row items-center">
                            <CheckCircle size={16} color="#22c55e" />
                            <Text className="text-green-600 font-bold text-sm ml-2">
                                {Math.round((course.match_probability || 0) * 100)}% Match
                            </Text>
                        </View>
                    </View>

                    <View className="bg-gray-50 p-5 rounded-3xl mb-6 border border-gray-100">
                        <View className="flex-row items-center mb-4">
                            <View className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mr-4">
                                <User size={20} color="#ec4899" />
                            </View>
                            <View>
                                <Text className="text-gray-400 text-xs font-bold uppercase">Instructor</Text>
                                <Text className="text-gray-800 font-bold text-base">{course.instructor_name || "TBA"}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center">
                            <View className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mr-4">
                                <Clock size={20} color="#ec4899" />
                            </View>
                            <View>
                                <Text className="text-gray-400 text-xs font-bold uppercase">Schedule</Text>
                                <Text className="text-gray-800 font-bold text-base">{course.schedule || "Not announced yet"}</Text>
                            </View>
                        </View>
                    </View>

                    <View className="mb-6">
                        <View className="flex-row items-center mb-3">
                            <Info size={18} color="#ec4899" />
                            <Text className="text-pink-500 font-bold text-sm ml-2 uppercase tracking-tight">About This Course</Text>
                        </View>
                        <Text className="text-gray-600 text-base leading-6">
                            {course.description || "No description provided for this course. Contact the instructor for more information."}
                        </Text>
                    </View>

                    <View className="flex-row items-center justify-between border-t border-gray-100 pt-4">
                        <View className="flex-row items-center">
                            <BookOpen size={16} color="#9CA3AF" />
                            <Text className="text-gray-400 text-xs font-semibold ml-1 uppercase">Course Details</Text>
                        </View>
                        <GraduationCap size={20} color="#E5E7EB" />
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}
