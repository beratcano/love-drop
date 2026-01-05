import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { useState } from "react";
import { X, Check } from "lucide-react-native";
import Svg, { Circle, Ellipse, Path, Rect, G } from "react-native-svg";

export interface AvatarConfig {
    skinColor: string;
    eyeStyle: number;
    noseStyle: number;
    mouthStyle: number;
    hairStyle: number;
    hairColor: string;
}

export const defaultAvatarConfig: AvatarConfig = {
    skinColor: "#FFDBB4",
    eyeStyle: 0,
    noseStyle: 0,
    mouthStyle: 0,
    hairStyle: 0,
    hairColor: "#4A3728"
};

const SKIN_COLORS = ["#FFDBB4", "#EDB98A", "#D08B5B", "#AE5D29", "#614335"];
const HAIR_COLORS = ["#4A3728", "#090806", "#B55239", "#D6C4C2", "#DEBC99", "#AA8866"];

interface AvatarBuilderProps {
    visible: boolean;
    onClose: () => void;
    onSave: (config: AvatarConfig) => void;
    initialConfig?: AvatarConfig;
}

export function AvatarPreview({ config, size = 120 }: { config: AvatarConfig; size?: number }) {
    const scale = size / 120;
    
    return (
        <Svg width={size} height={size} viewBox="0 0 120 120">
            <Circle cx="60" cy="60" r="55" fill={config.skinColor} />
            
            {config.hairStyle === 0 && (
                <Path d="M20 50 Q20 15 60 15 Q100 15 100 50 Q100 35 60 30 Q20 35 20 50" fill={config.hairColor} />
            )}
            {config.hairStyle === 1 && (
                <G>
                    <Ellipse cx="60" cy="25" rx="45" ry="20" fill={config.hairColor} />
                    <Rect x="15" y="20" width="90" height="25" fill={config.hairColor} />
                </G>
            )}
            {config.hairStyle === 2 && (
                <G>
                    <Path d="M15 55 Q15 10 60 10 Q105 10 105 55" fill={config.hairColor} />
                    <Path d="M15 55 L10 90" stroke={config.hairColor} strokeWidth="8" />
                    <Path d="M105 55 L110 90" stroke={config.hairColor} strokeWidth="8" />
                </G>
            )}
            {config.hairStyle === 3 && (
                <G>
                    <Circle cx="30" cy="25" r="12" fill={config.hairColor} />
                    <Circle cx="50" cy="18" r="12" fill={config.hairColor} />
                    <Circle cx="70" cy="18" r="12" fill={config.hairColor} />
                    <Circle cx="90" cy="25" r="12" fill={config.hairColor} />
                    <Circle cx="40" cy="30" r="10" fill={config.hairColor} />
                    <Circle cx="80" cy="30" r="10" fill={config.hairColor} />
                </G>
            )}
            {config.hairStyle === 4 && null}
            
            {config.eyeStyle === 0 && (
                <G>
                    <Ellipse cx="42" cy="55" rx="8" ry="10" fill="white" />
                    <Ellipse cx="78" cy="55" rx="8" ry="10" fill="white" />
                    <Circle cx="42" cy="57" r="5" fill="#4A3728" />
                    <Circle cx="78" cy="57" r="5" fill="#4A3728" />
                </G>
            )}
            {config.eyeStyle === 1 && (
                <G>
                    <Circle cx="42" cy="55" r="8" fill="white" />
                    <Circle cx="78" cy="55" r="8" fill="white" />
                    <Circle cx="42" cy="55" r="4" fill="#1a1a1a" />
                    <Circle cx="78" cy="55" r="4" fill="#1a1a1a" />
                </G>
            )}
            {config.eyeStyle === 2 && (
                <G>
                    <Path d="M35 55 Q42 48 49 55" stroke="#4A3728" strokeWidth="3" fill="none" />
                    <Path d="M71 55 Q78 48 85 55" stroke="#4A3728" strokeWidth="3" fill="none" />
                </G>
            )}
            {config.eyeStyle === 3 && (
                <G>
                    <Ellipse cx="42" cy="55" rx="10" ry="6" fill="white" />
                    <Ellipse cx="78" cy="55" rx="10" ry="6" fill="white" />
                    <Circle cx="44" cy="55" r="4" fill="#3498db" />
                    <Circle cx="80" cy="55" r="4" fill="#3498db" />
                </G>
            )}
            
            {config.noseStyle === 0 && (
                <Path d="M60 60 L55 75 L65 75 Z" fill={config.skinColor} stroke="#D4A574" strokeWidth="1" />
            )}
            {config.noseStyle === 1 && (
                <Circle cx="60" cy="70" r="6" fill={config.skinColor} stroke="#D4A574" strokeWidth="1" />
            )}
            {config.noseStyle === 2 && (
                <Path d="M60 58 Q55 70 60 75 Q65 70 60 58" fill={config.skinColor} stroke="#D4A574" strokeWidth="1" />
            )}
            {config.noseStyle === 3 && (
                <Ellipse cx="60" cy="70" rx="4" ry="6" fill={config.skinColor} stroke="#D4A574" strokeWidth="1" />
            )}
            
            {config.mouthStyle === 0 && (
                <Path d="M45 90 Q60 100 75 90" stroke="#e74c3c" strokeWidth="3" fill="none" />
            )}
            {config.mouthStyle === 1 && (
                <Ellipse cx="60" cy="92" rx="12" ry="6" fill="#e74c3c" />
            )}
            {config.mouthStyle === 2 && (
                <Path d="M48 92 L72 92" stroke="#c0392b" strokeWidth="3" />
            )}
            {config.mouthStyle === 3 && (
                <G>
                    <Path d="M45 88 Q60 98 75 88" stroke="#e74c3c" strokeWidth="3" fill="#fff" />
                </G>
            )}
        </Svg>
    );
}

export default function AvatarBuilder({ visible, onClose, onSave, initialConfig }: AvatarBuilderProps) {
    const [config, setConfig] = useState<AvatarConfig>(initialConfig || defaultAvatarConfig);

    const updateConfig = (key: keyof AvatarConfig, value: string | number) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        onSave(config);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View className="flex-1 bg-white">
                <View className="flex-row items-center justify-between px-6 pt-14 pb-4 border-b border-gray-100">
                    <TouchableOpacity onPress={onClose} className="p-2">
                        <X size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-900">Create Avatar</Text>
                    <TouchableOpacity onPress={handleSave} className="bg-pink-500 px-4 py-2 rounded-full">
                        <Check size={20} color="white" />
                    </TouchableOpacity>
                </View>

                <View className="items-center py-8 bg-gray-50">
                    <View className="bg-white p-6 rounded-full shadow-lg">
                        <AvatarPreview config={config} size={140} />
                    </View>
                </View>

                <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>
                    <Text className="text-gray-400 font-bold uppercase text-xs mb-4 mt-6 tracking-widest">Skin Color</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                        <View className="flex-row gap-3">
                            {SKIN_COLORS.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    onPress={() => updateConfig("skinColor", color)}
                                    className={`w-14 h-14 rounded-full border-4 ${config.skinColor === color ? "border-pink-500" : "border-gray-200"}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </View>
                    </ScrollView>

                    <Text className="text-gray-400 font-bold uppercase text-xs mb-4 tracking-widest">Hair Style</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                        <View className="flex-row gap-3">
                            {[0, 1, 2, 3, 4].map((style) => (
                                <TouchableOpacity
                                    key={style}
                                    onPress={() => updateConfig("hairStyle", style)}
                                    className={`w-16 h-16 rounded-2xl items-center justify-center ${config.hairStyle === style ? "bg-pink-100 border-2 border-pink-500" : "bg-gray-100"}`}
                                >
                                    <AvatarPreview config={{ ...config, hairStyle: style }} size={50} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <Text className="text-gray-400 font-bold uppercase text-xs mb-4 tracking-widest">Hair Color</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                        <View className="flex-row gap-3">
                            {HAIR_COLORS.map((color) => (
                                <TouchableOpacity
                                    key={color}
                                    onPress={() => updateConfig("hairColor", color)}
                                    className={`w-14 h-14 rounded-full border-4 ${config.hairColor === color ? "border-pink-500" : "border-gray-200"}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </View>
                    </ScrollView>

                    <Text className="text-gray-400 font-bold uppercase text-xs mb-4 tracking-widest">Eyes</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                        <View className="flex-row gap-3">
                            {[0, 1, 2, 3].map((style) => (
                                <TouchableOpacity
                                    key={style}
                                    onPress={() => updateConfig("eyeStyle", style)}
                                    className={`w-16 h-16 rounded-2xl items-center justify-center ${config.eyeStyle === style ? "bg-pink-100 border-2 border-pink-500" : "bg-gray-100"}`}
                                >
                                    <AvatarPreview config={{ ...config, eyeStyle: style }} size={50} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <Text className="text-gray-400 font-bold uppercase text-xs mb-4 tracking-widest">Nose</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                        <View className="flex-row gap-3">
                            {[0, 1, 2, 3].map((style) => (
                                <TouchableOpacity
                                    key={style}
                                    onPress={() => updateConfig("noseStyle", style)}
                                    className={`w-16 h-16 rounded-2xl items-center justify-center ${config.noseStyle === style ? "bg-pink-100 border-2 border-pink-500" : "bg-gray-100"}`}
                                >
                                    <AvatarPreview config={{ ...config, noseStyle: style }} size={50} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <Text className="text-gray-400 font-bold uppercase text-xs mb-4 tracking-widest">Mouth</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                        <View className="flex-row gap-3">
                            {[0, 1, 2, 3].map((style) => (
                                <TouchableOpacity
                                    key={style}
                                    onPress={() => updateConfig("mouthStyle", style)}
                                    className={`w-16 h-16 rounded-2xl items-center justify-center ${config.mouthStyle === style ? "bg-pink-100 border-2 border-pink-500" : "bg-gray-100"}`}
                                >
                                    <AvatarPreview config={{ ...config, mouthStyle: style }} size={50} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </ScrollView>
            </View>
        </Modal>
    );
}
