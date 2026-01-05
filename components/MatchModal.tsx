import { View, Text, Modal, Image, TouchableOpacity, Dimensions } from "react-native";
import Animated, {
    FadeIn,
    ZoomIn,
    SlideInLeft,
    SlideInRight,
    BounceIn
} from "react-native-reanimated";
import { AvatarPreview, AvatarConfig } from "./AvatarBuilder";
import { Database } from "../types/supabase";
import { MessageCircle, X } from "lucide-react-native";

type Course = Database["public"]["Tables"]["courses"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface MatchModalProps {
    visible: boolean;
    course: Course | null;
    userProfile: Profile | null;
    onClose: () => void;
    onSendMessage: () => void;
}

const { width } = Dimensions.get("window");

export default function MatchModal({ visible, course, userProfile, onClose, onSendMessage }: MatchModalProps) {
    if (!visible || !course) return null;

    const avatarConfig = userProfile?.avatar_config as AvatarConfig | null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/90 items-center justify-center p-6">
                <Animated.View
                    entering={ZoomIn.duration(600).springify()}
                    className="items-center mb-12"
                >
                    <Text className="text-4xl font-black text-white italic tracking-tighter"
                        style={{
                            textShadowColor: '#ec4899',
                            textShadowOffset: { width: 0, height: 0 },
                            textShadowRadius: 20
                        }}>
                        IT'S A
                    </Text>
                    <Text className="text-6xl font-black text-pink-500 italic tracking-tighter -mt-2"
                        style={{
                            textShadowColor: 'rgba(236, 72, 153, 0.5)',
                            textShadowOffset: { width: 0, height: 4 },
                            textShadowRadius: 10
                        }}>
                        MATCH!
                    </Text>
                </Animated.View>

                <View className="flex-row items-center justify-center -space-x-8 mb-16">
                    <Animated.View
                        entering={SlideInLeft.delay(200).springify().damping(12)}
                        className="z-10 bg-white p-1 rounded-full overflow-hidden border-4 border-white"
                        style={{ transform: [{ rotate: '-10deg' }] }}
                    >
                        {userProfile?.avatar_url ? (
                            <Image
                                source={{ uri: userProfile.avatar_url }}
                                className="w-32 h-32 rounded-full"
                            />
                        ) : avatarConfig ? (
                            <View className="w-32 h-32 bg-gray-100 items-center justify-center rounded-full overflow-hidden">
                                <AvatarPreview config={avatarConfig} size={128} />
                            </View>
                        ) : (
                            <View className="w-32 h-32 bg-gray-200 rounded-full" />
                        )}
                    </Animated.View>

                    <Animated.View
                        entering={SlideInRight.delay(200).springify().damping(12)}
                        className="bg-pink-100 p-1 rounded-full overflow-hidden border-4 border-white"
                        style={{ transform: [{ rotate: '10deg' }] }}
                    >
                        <Image
                            source={{ uri: course.image_url || 'https://via.placeholder.com/150' }}
                            className="w-32 h-32 rounded-full"
                        />
                    </Animated.View>
                </View>

                <Animated.Text
                    entering={FadeIn.delay(600)}
                    className="text-white text-center text-lg font-medium mb-8 px-8"
                >
                    You and <Text className="font-bold text-pink-400">{course.code}</Text> have liked each other.
                </Animated.Text>

                <Animated.View
                    entering={BounceIn.delay(800)}
                    className="w-full space-y-4"
                >
                    <TouchableOpacity
                        onPress={onSendMessage}
                        className="w-full bg-pink-500 py-4 rounded-full flex-row items-center justify-center shadow-lg shadow-pink-500/30"
                    >
                        <MessageCircle size={20} color="white" className="mr-2" />
                        <Text className="text-white font-bold text-lg">Send a Message</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onClose}
                        className="w-full bg-transparent border-2 border-white/30 py-4 rounded-full flex-row items-center justify-center mt-4"
                    >
                        <X size={20} color="white" className="mr-2" />
                        <Text className="text-white font-bold text-lg">Keep Swiping</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}
