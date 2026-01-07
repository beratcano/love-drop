import { View, Text, Modal, TouchableOpacity, ScrollView, Image, Dimensions } from "react-native";
import { Course, formatSchedule } from "../types/supabase";
import { X, Clock, BookOpen, GraduationCap, Info, CheckCircle, Award, Star } from "lucide-react-native";

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
                    <Text className="text-3xl font-black text-gray-900 mb-3 leading-tight">
                        {course.title}
                    </Text>

                    {/* Quick Stats Row */}
                    <View className="flex-row flex-wrap gap-2 mb-6">
                        <View className="bg-green-100 px-3 py-2 rounded-full flex-row items-center">
                            <CheckCircle size={14} color="#22c55e" />
                            <Text className="text-green-600 font-bold text-xs ml-1.5">
                                {Math.round((course.match_probability || 0) * 100)}% Match
                            </Text>
                        </View>
                        <View className={`px-3 py-2 rounded-full flex-row items-center ${course.is_elective ? "bg-blue-100" : "bg-orange-100"}`}>
                            <Star size={14} color={course.is_elective ? "#3b82f6" : "#f97316"} />
                            <Text className={`font-bold text-xs ml-1.5 ${course.is_elective ? "text-blue-600" : "text-orange-600"}`}>
                                {course.is_elective ? "Elective" : "Required"}
                            </Text>
                        </View>
                        <View className="bg-purple-100 px-3 py-2 rounded-full flex-row items-center">
                            <Award size={14} color="#9333ea" />
                            <Text className="text-purple-600 font-bold text-xs ml-1.5">
                                {course.credits || 3} Credits
                            </Text>
                        </View>
                    </View>

                    {/* Schedule Card */}
                    <View className="bg-gray-50 p-4 rounded-2xl mb-4 border border-gray-100">
                        <View className="flex-row items-center">
                            <View className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 mr-3">
                                <Clock size={18} color="#ec4899" />
                            </View>
                            <View>
                                <Text className="text-gray-400 text-xs font-bold uppercase">Schedule</Text>
                                <Text className="text-gray-800 font-bold text-sm">{formatSchedule(course)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Course Type Info */}
                    <View className={`p-4 rounded-2xl mb-4 border ${course.is_elective ? "bg-blue-50 border-blue-100" : "bg-orange-50 border-orange-100"}`}>
                        <View className="flex-row items-center">
                            <View className={`p-2.5 rounded-xl mr-3 ${course.is_elective ? "bg-blue-100" : "bg-orange-100"}`}>
                                <GraduationCap size={18} color={course.is_elective ? "#3b82f6" : "#f97316"} />
                            </View>
                            <View className="flex-1">
                                <Text className={`text-xs font-bold uppercase ${course.is_elective ? "text-blue-400" : "text-orange-400"}`}>
                                    {course.is_elective ? "Elective Course" : "Required Course"}
                                </Text>
                                <Text className={`font-semibold text-sm ${course.is_elective ? "text-blue-700" : "text-orange-700"}`}>
                                    {course.is_elective
                                        ? "Requires instructor approval after applying"
                                        : "Auto-enrolled when you swipe right"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* About Section */}
                    <View className="mb-6">
                        <View className="flex-row items-center mb-3">
                            <Info size={16} color="#ec4899" />
                            <Text className="text-pink-500 font-bold text-sm ml-2 uppercase tracking-tight">About This Course</Text>
                        </View>
                        <Text className="text-gray-600 text-base leading-6">
                            {course.description || "No description provided for this course. Contact the instructor for more information."}
                        </Text>
                    </View>

                    {/* Footer */}
                    <View className="flex-row items-center justify-between border-t border-gray-100 pt-4">
                        <View className="flex-row items-center">
                            <BookOpen size={16} color="#9CA3AF" />
                            <Text className="text-gray-400 text-xs font-semibold ml-1 uppercase">{course.code}</Text>
                        </View>
                        <Text className="text-gray-300 text-xs">{course.credits || 3} credit hours</Text>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}
