import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Course } from '../types/supabase';
import { getCourseColor } from '../utils/courseColors';

interface MonthlyCalendarProps {
    courses: Course[];
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_MAP: { [key: string]: number } = {
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
    'Sunday': 0
};

export default function MonthlyCalendar({ courses }: MonthlyCalendarProps) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-11
    const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Get first day of month and total days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday

    // Adjust so Monday is 0
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    // Generate calendar grid
    const totalCells = Math.ceil((daysInMonth + startOffset) / 7) * 7;
    const calendarDays = Array.from({ length: totalCells }, (_, i) => {
        const dayNum = i - startOffset + 1;
        if (dayNum < 1 || dayNum > daysInMonth) return null;
        return dayNum;
    });

    // Map courses to days of week (for repeating weekly schedule)
    const coursesByDayOfWeek: { [key: number]: Course[] } = {};
    courses.forEach(course => {
        if (course.day_of_week) {
            const dayNum = DAY_MAP[course.day_of_week];
            if (dayNum !== undefined) {
                if (!coursesByDayOfWeek[dayNum]) coursesByDayOfWeek[dayNum] = [];
                coursesByDayOfWeek[dayNum].push(course);
            }
        }
    });

    return (
        <View className="flex-1 bg-white">
            {/* Month Header */}
            <View className="px-6 py-3 border-b border-gray-100">
                <Text className="text-xl font-bold text-gray-900">{monthName}</Text>
            </View>

            {/* Day Headers */}
            <View className="flex-row border-b border-gray-100 bg-gray-50">
                {DAYS_OF_WEEK.map(day => (
                    <View key={day} className="flex-1 py-2 items-center">
                        <Text className="text-xs font-bold text-gray-400 uppercase">{day}</Text>
                    </View>
                ))}
            </View>

            {/* Calendar Grid */}
            <ScrollView className="flex-1">
                {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, weekIndex) => (
                    <View key={weekIndex} className="flex-row border-b border-gray-50">
                        {calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7).map((day, dayIndex) => {
                            if (!day) {
                                return <View key={dayIndex} className="flex-1 p-2 bg-gray-50/50" style={{ minHeight: 80 }} />;
                            }

                            const cellDate = new Date(currentYear, currentMonth, day);
                            const cellDayOfWeek = cellDate.getDay(); // 0 = Sunday
                            const adjustedDayOfWeek = cellDayOfWeek === 0 ? 6 : cellDayOfWeek - 1; // Mon=0, Sun=6
                            const dayCourses = coursesByDayOfWeek[adjustedDayOfWeek + 1] || []; // DAY_MAP uses 1-7

                            const isToday = cellDate.toDateString() === today.toDateString();

                            return (
                                <View
                                    key={dayIndex}
                                    className="flex-1 p-1 border-r border-gray-50 items-center bg-white"
                                    style={{ minHeight: 80 }}
                                >
                                    <View className="flex-row items-center mb-1 justify-center w-full">
                                        <View className={`w-7 h-7 rounded-full items-center justify-center ${isToday ? 'bg-pink-500' : ''}`}>
                                            <Text className={`text-xs font-bold ${isToday ? 'text-white' : 'text-gray-700'}`}>
                                                {day}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Course Dots */}
                                    <View className="flex-wrap flex-row gap-1 justify-center">
                                        {dayCourses.slice(0, 3).map((course, idx) => {
                                            const color = getCourseColor(course.id);
                                            return (
                                                <View
                                                    key={idx}
                                                    className="w-1.5 h-1.5 rounded-full"
                                                    style={{ backgroundColor: color.solid }}
                                                />
                                            );
                                        })}
                                        {dayCourses.length > 3 && (
                                            <Text className="text-[8px] text-gray-400 font-bold">
                                                +{dayCourses.length - 3}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
