import { useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import { Course } from "../../types/supabase";
import WeeklyCalendar from "../../components/WeeklyCalendar";
import MonthlyCalendar from "../../components/MonthlyCalendar";
import YearlyCalendar from "../../components/YearlyCalendar";
import ViewSwitcher, { ViewMode } from "../../components/ViewSwitcher";
import { useFocusEffect } from "expo-router";

export default function Schedule() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('week');

    useFocusEffect(
        useCallback(() => {
            fetchMatchedCourses();
        }, [])
    );

    async function fetchMatchedCourses() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get IDs of matched courses
            const { data: matches } = await supabase
                .from("matches")
                .select("course_id")
                .eq("user_id", user.id)
                .eq("status", "matched");

            if (matches && matches.length > 0) {
                const matchIds = matches.map(m => m.course_id);
                // Fetch full course details
                const { data: coursesData } = await supabase
                    .from("courses")
                    .select("*")
                    .in("id", matchIds);

                if (coursesData) {
                    setCourses(coursesData);
                }
            } else {
                setCourses([]);
            }

        } catch (error) {
            console.error("Error fetching schedule:", error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator color="#ec4899" size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top']}>
            <View className="px-6 py-4 border-b border-gray-100 flex-row justify-between items-end">
                <View>
                    <Text className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-1">
                        Academic Year
                    </Text>
                    <Text className="text-3xl font-bold text-gray-900">
                        Schedule
                    </Text>
                </View>
                <View className="bg-pink-100 px-3 py-1 rounded-full">
                    <Text className="text-pink-600 font-bold text-xs">
                        {courses.length} Classes
                    </Text>
                </View>
            </View>

            <ViewSwitcher currentView={viewMode} onViewChange={setViewMode} />

            {courses.length === 0 ? (
                <View className="flex-1 items-center justify-center p-8">
                    <Text className="text-gray-400 text-center font-medium text-lg mb-2">
                        No classes yet!
                    </Text>
                    <Text className="text-gray-300 text-center text-sm">
                        Swipe right on courses to add them to your schedule.
                    </Text>
                </View>
            ) : (
                <>
                    {viewMode === 'week' && <WeeklyCalendar courses={courses} />}
                    {viewMode === 'month' && <MonthlyCalendar courses={courses} />}
                    {viewMode === 'year' && <YearlyCalendar courses={courses} />}
                </>
            )}
        </SafeAreaView>
    );
}
