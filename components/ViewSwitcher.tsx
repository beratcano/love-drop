import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export type ViewMode = 'week' | 'month' | 'year';

interface ViewSwitcherProps {
    currentView: ViewMode;
    onViewChange: (view: ViewMode) => void;
}

export default function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
    const views: { id: ViewMode; label: string }[] = [
        { id: 'week', label: 'Week' },
        { id: 'month', label: 'Month' },
        { id: 'year', label: 'Year' },
    ];

    return (
        <View className="flex-row bg-gray-100 rounded-xl p-1 mx-6 mb-4">
            {views.map((view) => (
                <TouchableOpacity
                    key={view.id}
                    onPress={() => onViewChange(view.id)}
                    className={`flex-1 py-2 rounded-lg items-center ${currentView === view.id ? 'bg-white shadow-sm' : ''
                        }`}
                >
                    <Text
                        className={`font-bold text-sm ${currentView === view.id ? 'text-pink-600' : 'text-gray-500'
                            }`}
                    >
                        {view.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}
