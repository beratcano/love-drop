import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { CheckCircle, XCircle, Info, X } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
    message: string;
    type: ToastType;
    onDismiss: () => void;
}

export default function Toast({ message, type, onDismiss }: ToastProps) {
    const getStyles = () => {
        switch (type) {
            case "success":
                return {
                    bg: "bg-green-50",
                    border: "border-green-500",
                    text: "text-green-800",
                    icon: <CheckCircle size={24} color="#22c55e" fill="#dcfce7" />,
                    title: "Success"
                };
            case "error":
                return {
                    bg: "bg-red-50",
                    border: "border-red-500",
                    text: "text-red-800",
                    icon: <XCircle size={24} color="#ef4444" fill="#fee2e2" />,
                    title: "Error"
                };
            default:
                return {
                    bg: "bg-blue-50",
                    border: "border-blue-500",
                    text: "text-blue-800",
                    icon: <Info size={24} color="#3b82f6" fill="#dbeafe" />,
                    title: "Info"
                };
        }
    };

    const styles = getStyles();

    return (
        <Animated.View
            entering={FadeInUp.springify().damping(15)}
            exiting={FadeOutUp}
            className="w-full px-4 pt-2"
        >
            <SafeAreaView edges={['top']}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onDismiss}
                    className={`${styles.bg} border-l-4 ${styles.border} p-4 rounded-xl shadow-lg shadow-gray-200/50 flex-row items-center justify-between mx-2 mt-2`}
                >
                    <View className="flex-row items-center flex-1 gap-3">
                        {styles.icon}
                        <View className="flex-1">
                            <Text className={`font-bold ${styles.text} text-sm uppercase tracking-wide opacity-80 mb-0.5`}>
                                {styles.title}
                            </Text>
                            <Text className="text-gray-800 font-medium text-base leading-5">
                                {message}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </SafeAreaView>
        </Animated.View>
    );
}
