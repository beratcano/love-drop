import React from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { Course } from '../types/supabase';
import { getCourseColor } from '../utils/courseColors';

interface WeeklyCalendarProps {
    courses: Course[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const START_HOUR = 8;
const END_HOUR = 18;
const HOUR_HEIGHT = 60; // Reduced from 80
const HEADER_HEIGHT = 50;
const TIME_LABEL_WIDTH = 40; // Reduced from 50
const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMN_WIDTH = (SCREEN_WIDTH - TIME_LABEL_WIDTH) / 5;

// Helper to parse "HH:MM:SS" time string to hours (float)
const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + minutes / 60;
};

export default function WeeklyCalendar({ courses }: WeeklyCalendarProps) {
    const renderTimeLabels = () => {
        const labels = [];
        for (let i = START_HOUR; i <= END_HOUR; i++) {
            labels.push(
                <View key={i} style={{ height: HOUR_HEIGHT, justifyContent: 'flex-start' }}>
                    <Text className="text-xs text-gray-400 font-medium -mt-2">
                        {i > 12 ? `${i - 12} PM` : i === 12 ? '12 PM' : `${i} AM`}
                    </Text>
                </View>
            );
        }
        return labels;
    };

    const renderGridLines = () => {
        const lines = [];
        for (let i = START_HOUR; i <= END_HOUR; i++) {
            lines.push(
                <View
                    key={i}
                    style={{
                        height: HOUR_HEIGHT,
                        borderTopWidth: 1,
                        borderColor: '#f3f4f6'
                    }}
                />
            );
        }
        return lines;
    };

    const renderEvents = () => {
        return courses.map((course, index) => {
            if (!course.day_of_week || !course.start_time || !course.end_time) return null;

            const dayIndex = DAYS.indexOf(course.day_of_week);
            if (dayIndex === -1) return null;

            const startHour = parseTime(course.start_time);
            const endHour = parseTime(course.end_time);
            const duration = endHour - startHour;

            const top = (startHour - START_HOUR) * HOUR_HEIGHT;
            const height = duration * HOUR_HEIGHT;
            const left = TIME_LABEL_WIDTH + (dayIndex * COLUMN_WIDTH);

            const color = getCourseColor(course.id);

            return (
                <View
                    key={course.id}
                    className="absolute rounded-lg p-1 border-l-4 shadow-sm"
                    style={{
                        top,
                        left: left + 2, // 2px margin
                        width: COLUMN_WIDTH - 4, // 4px total margin
                        height: height - 2, // 2px gap
                        backgroundColor: color.bg,
                        borderColor: color.border,
                        zIndex: 10
                    }}
                >
                    <Text
                        numberOfLines={2}
                        className="text-[10px] font-bold leading-3 mb-0.5"
                        style={{ color: color.text }}
                    >
                        {course.code}
                    </Text>
                    {height > 30 && course.start_time && (
                        <Text
                            numberOfLines={1}
                            className="text-[8px] font-medium opacity-80"
                            style={{ color: color.text }}
                        >
                            {course.start_time.slice(0, 5)}
                        </Text>
                    )}
                </View>
            );
        });
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header: Days */}
            <View className="flex-row border-b border-gray-100" style={{ height: HEADER_HEIGHT, marginLeft: TIME_LABEL_WIDTH }}>
                {DAYS.map((day, index) => {
                    const today = new Date();
                    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
                    const mondayIndex = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Days since Monday
                    const currentDayDate = new Date(today);
                    currentDayDate.setDate(today.getDate() + mondayIndex + index);

                    const isToday = currentDayDate.toDateString() === today.toDateString();
                    const dayNum = currentDayDate.getDate();

                    return (
                        <View key={day} style={{ width: COLUMN_WIDTH }} className="items-center justify-center bg-white border-l border-gray-50">
                            <Text className="text-gray-400 font-bold uppercase text-[9px] mb-1">{day.slice(0, 3)}</Text>
                            <View className={`w-6 h-6 rounded-full items-center justify-center ${isToday ? 'bg-pink-500' : ''}`}>
                                <Text className={`font-bold text-xs ${isToday ? 'text-white' : 'text-gray-900'}`}>
                                    {dayNum}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* Scrollable Body */}
            <ScrollView className="flex-1" contentContainerStyle={{ height: (END_HOUR - START_HOUR + 1) * HOUR_HEIGHT + 20 }}>
                <View className="flex-row">
                    {/* Time Labels */}
                    <View style={{ width: TIME_LABEL_WIDTH }} className="items-end pr-2 pt-2 bg-white z-20">
                        {renderTimeLabels()}
                    </View>

                    {/* Grid & Events */}
                    <View className="flex-1 relative">
                        {renderGridLines()}
                        {renderEvents()}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
