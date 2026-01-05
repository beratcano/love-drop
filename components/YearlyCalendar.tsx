import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Course } from '../types/supabase';
import { getCourseColor } from '../utils/courseColors';

interface YearlyCalendarProps {
    courses: Course[];
}

const MONTHS = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
];

const DAY_MAP: { [key: string]: number } = {
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
};

export default function YearlyCalendar({ courses }: YearlyCalendarProps) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthIndex = today.getMonth(); // 0-11

    // Count courses by day of week
    const courseCountByDay: { [key: number]: number } = {};
    courses.forEach(course => {
        if (course.day_of_week) {
            const dayNum = DAY_MAP[course.day_of_week];
            if (dayNum !== undefined) {
                courseCountByDay[dayNum] = (courseCountByDay[dayNum] || 0) + 1;
            }
        }
    });

    const totalCourses = courses.length;

    return (
        <View className="flex-1 bg-white">
            {/* Year Header */}
            <View className="px-6 py-3 border-b border-gray-100 flex-row items-end justify-between">
                <View>
                    <Text className="text-xs text-gray-400 font-bold uppercase mb-1">Academic Calendar</Text>
                    <Text className="text-2xl font-bold text-gray-900">{currentYear}</Text>
                </View>
                <View className="bg-pink-50 px-3 py-1 rounded-full">
                    <Text className="text-pink-600 font-bold text-xs">
                        {totalCourses} Total Classes
                    </Text>
                </View>
            </View>

            {/* Month Grid (3x4) */}
            <ScrollView className="flex-1 p-4">
                <View className="flex-row flex-wrap">
                    {MONTHS.map((month, monthIndex) => {
                        const isCurrentMonth = monthIndex === currentMonthIndex;

                        // Get calendar info for this month
                        const firstDay = new Date(currentYear, monthIndex, 1);
                        const lastDay = new Date(currentYear, monthIndex + 1, 0);
                        const daysInMonth = lastDay.getDate();
                        const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday
                        const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Adjust to Monday = 0

                        // Count courses for this month (courses that fall on any day of week in this month)
                        const monthCourseCount = courses.filter(c => c.day_of_week).length;

                        return (
                            <View
                                key={month}
                                style={{ width: '33.33%' }}
                                className="p-1" // Reduced padding from p-2
                            >
                                <View className={`rounded-xl p-2 border ${isCurrentMonth ? 'bg-pink-50 border-pink-200' : 'bg-gray-50 border-gray-100'}`}>
                                    <Text className={`text-xs font-bold uppercase mb-2 ${isCurrentMonth ? 'text-pink-600' : 'text-gray-400'}`}>
                                        {month.slice(0, 3)}
                                    </Text>

                                    {/* Mini Calendar Grid - 6 rows x 7 columns */}
                                    <View className="space-y-0.5">
                                        {Array.from({ length: 6 }).map((_, weekIndex) => (
                                            <View key={weekIndex} className="flex-row gap-0.5">
                                                {Array.from({ length: 7 }).map((_, dayIndex) => {
                                                    const cellIndex = weekIndex * 7 + dayIndex;
                                                    const dayNum = cellIndex - startOffset + 1;

                                                    // Check if this cell has a valid date
                                                    if (dayNum < 1 || dayNum > daysInMonth) {
                                                        return <View key={dayIndex} className="w-1 h-1" />;
                                                    }

                                                    // Check if courses fall on this day of week
                                                    const cellDate = new Date(currentYear, monthIndex, dayNum);
                                                    const cellDayOfWeek = cellDate.getDay(); // 0 = Sunday
                                                    const adjustedDayOfWeek = cellDayOfWeek === 0 ? 6 : cellDayOfWeek - 1; // Mon=0, Sun=6

                                                    // Check if any course is scheduled for this day of week
                                                    const hasCourse = courses.some(c => {
                                                        if (!c.day_of_week) return false;
                                                        const courseDayNum = DAY_MAP[c.day_of_week];
                                                        return courseDayNum === adjustedDayOfWeek + 1; // DAY_MAP uses 1-7
                                                    });

                                                    // Check if this is today
                                                    const isToday = cellDate.toDateString() === today.toDateString();

                                                    return (
                                                        <View
                                                            key={dayIndex}
                                                            className={`w-1 h-1 rounded-sm ${isToday ? 'bg-pink-600' :
                                                                hasCourse ? 'bg-pink-400' :
                                                                    'bg-gray-200'
                                                                }`}
                                                        />
                                                    );
                                                })}
                                            </View>
                                        ))}
                                    </View>

                                    {/* Course Count */}
                                    {monthCourseCount > 0 && (
                                        <Text className="text-pink-600 font-bold text-xs mt-2">
                                            {monthCourseCount} {monthCourseCount === 1 ? 'class' : 'classes'}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}
