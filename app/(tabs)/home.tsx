import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { View, Text, ActivityIndicator, Dimensions, TouchableOpacity, Platform, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/supabase";
import SwipeCard from "../../components/SwipeCard";
import CourseDetailsModal from "../../components/CourseDetailsModal";
import { X, Heart, RefreshCw, Filter, Check } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { useToast } from "../../context/ToastContext";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
    interpolate,
    Extrapolation
} from "react-native-reanimated";

import MatchModal from "../../components/MatchModal";

type Course = Database["public"]["Tables"]["courses"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

type FilterType = "all" | "elective" | "required";

export default function Home() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filter, setFilter] = useState<FilterType>("all");
    const [matchModalVisible, setMatchModalVisible] = useState(false);
    const [matchedCourse, setMatchedCourse] = useState<Course | null>(null);
    const [userProfile, setUserProfile] = useState<Profile | null>(null);
    const router = useRouter();
    const { showToast } = useToast();

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    useFocusEffect(
        useCallback(() => {
            fetchCourses();
        }, [filter])
    );

    async function fetchCourses() {
        try {
            setLoading(true);
            console.log("Fetching courses...");
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                console.log("No user found, redirecting to login:", userError?.message);
                router.replace("/(auth)/login");
                return;
            }

            console.log("User found:", user.id);

            const { data: matches, error: matchesError } = await supabase
                .from("matches")
                .select("course_id")
                .eq("user_id", user.id);

            if (matchesError) {
                console.error("Error fetching matches:", matchesError.message);
            }

            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (profile) {
                setUserProfile(profile);
            }

            const matchedIds = matches?.map(m => m.course_id) || [];
            console.log("Matched IDs:", matchedIds);

            let query = supabase.from("courses").select("*");

            if (filter === "elective") {
                query = query.eq("is_elective", true);
            } else if (filter === "required") {
                query = query.eq("is_elective", false);
            }

            const { data: allCourses, error } = await query;

            if (error) {
                console.error("Error fetching courses:", error.message);
                showToast(error.message, "error");
            } else if (allCourses) {
                const newCourses = allCourses.filter(c => !matchedIds.includes(c.id));
                console.log("Total courses found:", allCourses.length);
                console.log("Courses after filter:", newCourses.length);
                setCourses(newCourses);
                setCurrentIndex(0);
            }
        } catch (e) {
            console.error("Unexpected error in fetchCourses:", e);
        } finally {
            setLoading(false);
        }
    }

    const completeSwipe = useCallback(async (direction: "left" | "right") => {
        const currentCourse = courses[currentIndex];
        const { data: { user } } = await supabase.auth.getUser();

        if (user && currentCourse) {
            const status = direction === "right"
                ? (Math.random() < (currentCourse.match_probability || 0.5) ? "matched" : "pending")
                : "rejected";

            await supabase.from("matches").insert({
                user_id: user.id,
                course_id: currentCourse.id,
                status: status
            });

            if (status === "matched") {
                setMatchedCourse(currentCourse);
                setMatchModalVisible(true);
            }
        }

        translateX.value = 0;
        translateY.value = 0;
        setCurrentIndex(prev => prev + 1);
    }, [courses, currentIndex, translateX, translateY]);

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

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <View className="items-center">
                    <ActivityIndicator size="large" color="#ec4899" />
                    <Text className="mt-4 text-gray-400 font-medium">Finding courses...</Text>
                </View>
            </View>
        );
    }

    const handleReset = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from("matches").delete().eq("user_id", user.id);
            setCurrentIndex(0);
            await fetchCourses();
        }
        setLoading(false);
    };

    const applyFilter = (newFilter: FilterType) => {
        setFilter(newFilter);
        setFilterModalVisible(false);
    };

    if (currentIndex >= courses.length) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white p-8">
                <View className="bg-pink-50 p-8 rounded-full mb-8">
                    <RefreshCw size={48} color="#ec4899" strokeWidth={2.5} />
                </View>
                <Text className="text-3xl font-black text-gray-900 text-center mb-4 tracking-tight">
                    All caught up!
                </Text>
                <Text className="text-gray-500 text-center mb-10 text-lg leading-6">
                    You've swiped through all available courses.
                </Text>
                <TouchableOpacity
                    onPress={handleReset}
                    activeOpacity={0.8}
                    className="bg-pink-500 px-10 py-4 rounded-2xl shadow-lg shadow-pink-200"
                >
                    <Text className="text-white font-bold text-lg">Reset My Swipes</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const currentCourse = courses[currentIndex];

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView className="flex-1 bg-white flex-col">
                <View className="px-8 py-6 flex-row justify-between items-center w-full pt-10">
                    <View>
                        <Text className="text-4xl font-black text-pink-500 tracking-tighter">Love Drop</Text>
                        <Text className="text-gray-400 font-medium text-sm">Find your perfect course match</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => setFilterModalVisible(true)}
                        className="bg-gray-100 p-3 rounded-full"
                    >
                        <Filter size={22} color={filter !== "all" ? "#ec4899" : "#6B7280"} />
                    </TouchableOpacity>
                </View>

                <View className="flex-1 items-center justify-center w-full relative px-6 py-4">
                    <GestureDetector gesture={gesture}>
                        <Animated.View
                            className="w-full h-full z-20"
                            style={animatedStyle}
                        >
                            <SwipeCard
                                course={currentCourse}
                                onPress={() => setModalVisible(true)}
                            />
                        </Animated.View>
                    </GestureDetector>
                </View>

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
                        className="bg-pink-500 p-6 rounded-full shadow-2xl shadow-pink-200"
                        onPress={() => {
                            translateX.value = withSpring(SCREEN_WIDTH * 1.5);
                            completeSwipe("right");
                        }}
                    >
                        <Heart size={40} color="white" fill="white" />
                    </TouchableOpacity>
                </View>

                <CourseDetailsModal
                    course={currentCourse}
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                />

                <Modal
                    visible={filterModalVisible}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setFilterModalVisible(false)}
                >
                    <TouchableOpacity
                        className="flex-1 bg-black/50 justify-center items-center"
                        activeOpacity={1}
                        onPress={() => setFilterModalVisible(false)}
                    >
                        <View className="bg-white rounded-3xl p-6 mx-8 w-72">
                            <Text className="text-xl font-bold text-gray-900 mb-4">Filter Courses</Text>

                            <TouchableOpacity
                                className={`flex-row items-center justify-between py-4 px-4 rounded-2xl mb-2 ${filter === "all" ? "bg-pink-50" : "bg-gray-50"}`}
                                onPress={() => applyFilter("all")}
                            >
                                <Text className={`font-semibold ${filter === "all" ? "text-pink-600" : "text-gray-700"}`}>All Courses</Text>
                                {filter === "all" && <Check size={20} color="#ec4899" />}
                            </TouchableOpacity>

                            <TouchableOpacity
                                className={`flex-row items-center justify-between py-4 px-4 rounded-2xl mb-2 ${filter === "elective" ? "bg-pink-50" : "bg-gray-50"}`}
                                onPress={() => applyFilter("elective")}
                            >
                                <Text className={`font-semibold ${filter === "elective" ? "text-pink-600" : "text-gray-700"}`}>Elective Only</Text>
                                {filter === "elective" && <Check size={20} color="#ec4899" />}
                            </TouchableOpacity>

                            <TouchableOpacity
                                className={`flex-row items-center justify-between py-4 px-4 rounded-2xl ${filter === "required" ? "bg-pink-50" : "bg-gray-50"}`}
                                onPress={() => applyFilter("required")}
                            >
                                <Text className={`font-semibold ${filter === "required" ? "text-pink-600" : "text-gray-700"}`}>Required Only</Text>
                                {filter === "required" && <Check size={20} color="#ec4899" />}
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>

                <MatchModal
                    visible={matchModalVisible}
                    course={matchedCourse}
                    userProfile={userProfile}
                    onClose={() => setMatchModalVisible(false)}
                    onSendMessage={() => {
                        setMatchModalVisible(false);
                        if (matchedCourse && userProfile) {
                            // Find the match ID first? Alternatively pass params to create chat immediately?
                            // For simplicity, we navigate. The chat fetch might need logic.
                            // Actually, we just inserted the match record in completeSwipe.
                            // We should probably get the match ID. But let's check completeSwipe again.
                            // Supabase insert doesn't return ID by default unless .select() is used.
                            // But wait, the route /chat expects matchId.

                            // We need to fetch the match ID or assume the chat screen can handle it?
                            // Let's just navigate to matches tab for now or fix completeSwipe to get ID.
                            // Actually, better to fetch the latest match for this course.

                            // QUICK FIX: Pass data to get match ID in chat screen? 
                            // Or better: Let's modify completeSwipe to get the ID.
                            // Since I can't easily modify completeSwipe's variable scope right here inside JSX callback without refactoring,
                            // I will fetch the match ID inside the onSendMessage callback here or navigate to Matches tab.

                            // Let's try to find the match quickly.

                            supabase.from("matches")
                                .select("id")
                                .eq("user_id", userProfile.id)
                                .eq("course_id", matchedCourse.id)
                                .single()
                                .then(({ data }) => {
                                    if (data) {
                                        router.push({
                                            pathname: "/chat",
                                            params: { matchId: data.id.toString(), courseCode: matchedCourse.code }
                                        });
                                    } else {
                                        // Fallback to matches page if something weird happens
                                        router.push("/(tabs)/matches");
                                    }
                                });
                        }
                    }}
                />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

