import { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions, Modal, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Course, Profile } from "../../types/supabase";
import { X, Heart, RefreshCw, ChevronDown, Users, BookOpen } from "lucide-react-native";
import StudentSwipeCard from "../../components/StudentSwipeCard";
import { GestureDetector, Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
    interpolate,
    Extrapolation
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

type PendingStudent = {
    match_id: number;
    student: Profile;
};

export default function TeacherCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [pendingStudents, setPendingStudents] = useState<PendingStudent[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const router = useRouter();

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    useFocusEffect(
        useCallback(() => {
            fetchTeacherCourses();
        }, [])
    );

    useEffect(() => {
        if (selectedCourse) {
            fetchPendingStudents();
        }
    }, [selectedCourse]);

    async function fetchTeacherCourses() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.replace("/(auth)/login");
                return;
            }

            // Get profile
            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (profileData) {
                setProfile(profileData);
                if (profileData.is_student) {
                    router.replace("/(tabs)/home");
                    return;
                }
            }

            // Get courses taught by this teacher
            const { data: coursesData, error } = await supabase
                .from("courses")
                .select("*")
                .eq("instructor_id", user.id);

            if (error) {
                console.error("Error fetching courses:", error);
            } else if (coursesData && coursesData.length > 0) {
                setCourses(coursesData);
                if (!selectedCourse) {
                    setSelectedCourse(coursesData[0]);
                }
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchPendingStudents() {
        if (!selectedCourse) return;

        try {
            // Get pending matches for this course
            const { data: matches, error } = await supabase
                .from("matches")
                .select("id, user_id")
                .eq("course_id", selectedCourse.id)
                .eq("status", "pending");

            if (error) {
                console.error("Error fetching matches:", error);
                return;
            }

            if (!matches || matches.length === 0) {
                setPendingStudents([]);
                setCurrentIndex(0);
                return;
            }

            // Get student profiles
            const studentIds = matches.map(m => m.user_id);
            const { data: students } = await supabase
                .from("profiles")
                .select("*")
                .in("id", studentIds);

            const studentMap = Object.fromEntries((students || []).map(s => [s.id, s]));

            const pending: PendingStudent[] = matches.map(match => ({
                match_id: match.id,
                student: studentMap[match.user_id] || { id: match.user_id, full_name: "Unknown" } as Profile
            }));

            setPendingStudents(pending);
            setCurrentIndex(0);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const completeSwipe = useCallback(async (direction: "left" | "right") => {
        const currentStudent = pendingStudents[currentIndex];
        if (!currentStudent) return;

        const newStatus = direction === "right" ? "matched" : "rejected";

        await supabase
            .from("matches")
            .update({ status: newStatus })
            .eq("id", currentStudent.match_id);

        translateX.value = 0;
        translateY.value = 0;
        setCurrentIndex(prev => prev + 1);
    }, [pendingStudents, currentIndex, translateX, translateY]);

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd((event) => {
            if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
                const direction = event.translationX > 0 ? "right" : "left";
                translateX.value = withSpring(event.translationX > 0 ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5);
                runOnJS(completeSwipe)(direction);
            } else {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            translateX.value,
            [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            [-10, 0, 10],
            Extrapolation.CLAMP
        );

        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotate: `${rotate}deg` }
            ]
        };
    });

    const handleCourseSelect = (course: Course) => {
        setSelectedCourse(course);
        setDropdownVisible(false);
        setCurrentIndex(0);
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    if (courses.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center p-8">
                <BookOpen size={48} color="#D1D5DB" />
                <Text className="text-gray-400 text-center font-medium text-lg mt-4 mb-2">
                    No courses assigned
                </Text>
                <Text className="text-gray-300 text-center text-sm">
                    You haven't been assigned to any courses yet.
                </Text>
            </SafeAreaView>
        );
    }

    const currentStudent = pendingStudents[currentIndex];
    const allSwiped = currentIndex >= pendingStudents.length;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView className="flex-1 bg-white">
                {/* Header with dropdown */}
                <View className="px-6 py-4 flex-row justify-between items-center border-b border-gray-100">
                    <View className="flex-1">
                        <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">
                            Teaching as
                        </Text>
                        <TouchableOpacity
                            className="flex-row items-center"
                            onPress={() => setDropdownVisible(true)}
                        >
                            <Text className="text-2xl font-bold text-blue-600 mr-2">
                                {selectedCourse?.code}
                            </Text>
                            <ChevronDown size={24} color="#3b82f6" />
                        </TouchableOpacity>
                        <Text className="text-gray-500 text-sm mt-0.5" numberOfLines={1}>
                            {selectedCourse?.title}
                        </Text>
                    </View>
                    <View className="bg-blue-100 px-3 py-1.5 rounded-full flex-row items-center">
                        <Users size={14} color="#3b82f6" />
                        <Text className="text-blue-600 font-bold text-sm ml-1">
                            {pendingStudents.length - currentIndex}
                        </Text>
                    </View>
                </View>

                {/* Swipe area or empty state */}
                {allSwiped || pendingStudents.length === 0 ? (
                    <View className="flex-1 items-center justify-center p-8">
                        <View className="bg-blue-50 p-8 rounded-full mb-8">
                            <RefreshCw size={48} color="#3b82f6" strokeWidth={2.5} />
                        </View>
                        <Text className="text-3xl font-black text-gray-900 text-center mb-4 tracking-tight">
                            All caught up!
                        </Text>
                        <Text className="text-gray-500 text-center mb-10 text-lg leading-6">
                            No pending students for {selectedCourse?.code}.
                        </Text>
                        <TouchableOpacity
                            onPress={fetchPendingStudents}
                            activeOpacity={0.8}
                            className="bg-blue-500 px-10 py-4 rounded-2xl shadow-lg"
                        >
                            <Text className="text-white font-bold text-lg">Refresh</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <View className="flex-1 items-center justify-center px-6 py-4">
                            <GestureDetector gesture={gesture}>
                                <Animated.View
                                    className="w-full h-full"
                                    style={animatedStyle}
                                >
                                    <StudentSwipeCard
                                        student={currentStudent.student}
                                        courseCode={selectedCourse?.code || ""}
                                    />
                                </Animated.View>
                            </GestureDetector>
                        </View>

                        {/* Action buttons */}
                        <View className="flex-row gap-10 justify-center items-center pb-12 pt-4">
                            <TouchableOpacity
                                activeOpacity={0.7}
                                className="bg-white p-6 rounded-full shadow-xl border border-red-50"
                                onPress={() => {
                                    translateX.value = withSpring(-SCREEN_WIDTH * 1.5);
                                    completeSwipe("left");
                                }}
                            >
                                <X size={40} color="#ef4444" strokeWidth={3} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.7}
                                className="bg-blue-500 p-6 rounded-full shadow-2xl"
                                onPress={() => {
                                    translateX.value = withSpring(SCREEN_WIDTH * 1.5);
                                    completeSwipe("right");
                                }}
                            >
                                <Heart size={40} color="white" fill="white" />
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {/* Course dropdown modal */}
                <Modal
                    visible={dropdownVisible}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setDropdownVisible(false)}
                >
                    <TouchableOpacity
                        className="flex-1 bg-black/50 justify-start pt-32"
                        activeOpacity={1}
                        onPress={() => setDropdownVisible(false)}
                    >
                        <View className="bg-white mx-6 rounded-2xl overflow-hidden shadow-2xl">
                            <View className="p-4 border-b border-gray-100">
                                <Text className="text-lg font-bold text-gray-900">Select Course</Text>
                            </View>
                            <ScrollView className="max-h-80">
                                {courses.map((course) => (
                                    <TouchableOpacity
                                        key={course.id}
                                        className={`p-4 flex-row items-center justify-between border-b border-gray-50 ${
                                            selectedCourse?.id === course.id ? "bg-blue-50" : ""
                                        }`}
                                        onPress={() => handleCourseSelect(course)}
                                    >
                                        <View className="flex-1">
                                            <Text className={`font-bold ${
                                                selectedCourse?.id === course.id ? "text-blue-600" : "text-gray-900"
                                            }`}>
                                                {course.code}
                                            </Text>
                                            <Text className="text-gray-500 text-sm" numberOfLines={1}>
                                                {course.title}
                                            </Text>
                                        </View>
                                        {selectedCourse?.id === course.id && (
                                            <View className="bg-blue-500 w-6 h-6 rounded-full items-center justify-center">
                                                <Text className="text-white font-bold text-xs">✓</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}
