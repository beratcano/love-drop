import { View, Text, TouchableOpacity, ScrollView, Modal, ActivityIndicator, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { X, Check } from "lucide-react-native";
import { SvgXml } from 'react-native-svg';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

export interface AvatarConfig {
    style: 'avataaars';
    seed: string;
    eyes?: string;
    eyebrows?: string;
    mouth?: string;
    top?: string;
    hairColor?: string;
    facialHair?: string;
    facialHairColor?: string;
    accessories?: string;
    accessoriesColor?: string;
    clothing?: string;
    clothingColor?: string;
    skinColor?: string;
    backgroundColor?: string;
}

export const defaultAvatarConfig: AvatarConfig = {
    style: "avataaars",
    seed: "default",
    eyes: "default",
    eyebrows: "default",
    mouth: "smile",
    top: "shortRound",
    hairColor: "2c1b18",
    skinColor: "edb98a",
    clothing: "shirtCrewNeck",
    clothingColor: "65c9ff",
    backgroundColor: "b6e3f4"
};

// Validated Options from DiceBear Documentation
const TOP_OPTIONS = [
    "bigHair", "bob", "bun", "curly", "curvy", "dreads", "dreads01", "dreads02",
    "frida", "frizzle", "fro", "froBand", "hat", "hijab", "longButNotTooLong",
    "miaWallace", "shaggy", "shaggyMullet", "shavedSides", "shortCurly", "shortFlat",
    "shortRound", "shortWaved", "sides", "straight01", "straight02",
    "straightAndStrand", "theCaesar", "theCaesarAndSidePart", "turban",
    "winterHat1", "winterHat02", "winterHat03", "winterHat04"
];

const ACCESSORIES_OPTIONS = [
    "eyepatch", "kurt", "prescription01", "prescription02", "round",
    "sunglasses", "wayfarers"
];

const CLOTHING_OPTIONS = [
    "blazerAndShirt", "blazerAndSweater", "collarAndSweater", "graphicShirt",
    "hoodie", "overall", "shirtCrewNeck", "shirtScoopNeck", "shirtVNeck"
];

const EYES_OPTIONS = [
    "closed", "cry", "default", "eyeRoll", "happy", "hearts", "side",
    "squint", "surprised", "wink", "winkWacky", "xDizzy"
];

const EYEBROWS_OPTIONS = [
    "angry", "angryNatural", "default", "defaultNatural", "flatNatural",
    "frownNatural", "raisedExcited", "raisedExcitedNatural", "sadConcerned",
    "sadConcernedNatural", "unibrowNatural", "upDown", "upDownNatural"
];

const MOUTH_OPTIONS = [
    "concerned", "default", "disbelief", "eating", "grimace", "sad",
    "screamOpen", "serious", "smile", "tongue", "twinkle", "vomit"
];

const FACIAL_HAIR_OPTIONS = [
    "beardLight", "beardMajestic", "beardMedium", "moustacheFancy", "moustacheMagnum"
];

const HAIR_COLORS = [
    { name: "Auburn", hex: "a55728" },
    { name: "Black", hex: "2c1b18" },
    { name: "Blonde", hex: "b58143" },
    { name: "Golden", hex: "d6b370" },
    { name: "Brown", hex: "724133" },
    { name: "Dark", hex: "4a312c" },
    { name: "Pink", hex: "f59797" },
    { name: "Platinum", hex: "ecdcbf" },
    { name: "Red", hex: "c93305" },
    { name: "Gray", hex: "e8e1e1" }
];

const SKIN_COLORS = [
    { name: "Tanned", hex: "fd9841" },
    { name: "Yellow", hex: "f8d25c" },
    { name: "Pale", hex: "ffdbb4" },
    { name: "Light", hex: "edb98a" },
    { name: "Brown", hex: "d08b5b" },
    { name: "Dark Brown", hex: "ae5d29" },
    { name: "Black", hex: "614335" }
];

const COLORS_HEX = [
    { name: "Black", hex: "262e33" },
    { name: "Blue", hex: "65c9ff" },
    { name: "Gray", hex: "929598" },
    { name: "Heather", hex: "3c4f5c" },
    { name: "Pastel Blue", hex: "b1e2ff" },
    { name: "Pastel Green", hex: "a7ffc4" },
    { name: "Pastel Orange", hex: "ffdeb5" },
    { name: "Pastel Red", hex: "ffafb9" },
    { name: "Pastel Yellow", hex: "ffffb1" },
    { name: "Pink", hex: "ff488e" },
    { name: "Red", hex: "ff5c5c" },
    { name: "White", hex: "ffffff" }
];

const BACKGROUND_COLORS = [
    { name: "Sky Blue", hex: "b6e3f4" },
    { name: "Lavender", hex: "c0aede" },
    { name: "Periwinkle", hex: "d1d4f9" },
    { name: "Pink", hex: "ffd5dc" },
    { name: "Peach", hex: "fab1a0" },
    { name: "Mint", hex: "81ecec" },
    { name: "Sage", hex: "00b894" },
    { name: "Coral", hex: "fd79a8" },
    { name: "Yellow", hex: "fdcb6e" },
    { name: "Gray", hex: "dfe6e9" },
    { name: "Slate", hex: "636e72" },
    { name: "White", hex: "ffffff" }
];

interface AvatarBuilderProps {
    visible: boolean;
    onClose: () => void;
    onSave: (config: AvatarConfig) => void;
    initialConfig?: AvatarConfig;
}

function generateAvatarSvg(config: AvatarConfig): string {
    try {
        const options: any = {
            seed: config.seed || 'default',
        };

        // Background color (single color)
        if (config.backgroundColor) {
            options.backgroundColor = [config.backgroundColor];
        }

        // Face features
        if (config.eyes) options.eyes = [config.eyes];
        if (config.eyebrows) options.eyebrows = [config.eyebrows];
        if (config.mouth) options.mouth = [config.mouth];

        // Hair
        if (config.top) options.top = [config.top];
        if (config.hairColor) options.hairColor = [config.hairColor];

        // Facial hair - need probability 100 to always show when selected
        if (config.facialHair) {
            options.facialHair = [config.facialHair];
            options.facialHairProbability = 100;
        } else {
            options.facialHairProbability = 0;
        }
        if (config.facialHairColor) options.facialHairColor = [config.facialHairColor];

        // Accessories - need probability 100 to always show when selected
        if (config.accessories) {
            options.accessories = [config.accessories];
            options.accessoriesProbability = 100;
        } else {
            options.accessoriesProbability = 0;
        }
        if (config.accessoriesColor) options.accessoriesColor = [config.accessoriesColor];

        // Clothing
        if (config.clothing) options.clothing = [config.clothing];
        if (config.clothingColor) options.clothesColor = [config.clothingColor];

        // Skin
        if (config.skinColor) options.skinColor = [config.skinColor];

        const avatar = createAvatar(avataaars, options);
        return avatar.toString();
    } catch (err) {
        console.error('Error generating avatar:', err);
        return '';
    }
}

// Optimization: Memoize the preview component
const OptionPreview = ({
    optionKey,
    value,
    currentConfig,
    isSelected,
    onSelect
}: {
    optionKey: keyof AvatarConfig,
    value: string,
    currentConfig: AvatarConfig,
    isSelected: boolean,
    onSelect: () => void
}) => {
    const [svg, setSvg] = useState<string>('');

    useEffect(() => {
        const previewConfig = {
            ...currentConfig,
            [optionKey]: value,
            backgroundColor: "ffffff"
        };
        const svgString = generateAvatarSvg(previewConfig as AvatarConfig);
        setSvg(svgString);
    }, [currentConfig, optionKey, value]);

    return (
        <TouchableOpacity
            onPress={onSelect}
            className={`w-20 h-20 m-1 rounded-xl bg-gray-50 items-center justify-center border-2 ${isSelected ? "border-pink-500 bg-pink-50" : "border-gray-200"}`}
        >
            {svg ? (
                <SvgXml xml={svg} width={50} height={50} />
            ) : (
                <ActivityIndicator size="small" color="#ec4899" />
            )}
            {isSelected && (
                <View className="absolute top-1 right-1 bg-pink-500 rounded-full p-0.5">
                    <Check size={10} color="white" />
                </View>
            )}
        </TouchableOpacity>
    );
};

export function AvatarPreview({ config, size = 120 }: { config: AvatarConfig; size?: number }) {
    const [svg, setSvg] = useState<string>('');

    useEffect(() => {
        try {
            const svgString = generateAvatarSvg(config);
            setSvg(svgString);
        } catch (err) {
            console.error('Avatar generation error:', err);
        }
    }, [config]);

    return (
        <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
            {svg ? (
                <SvgXml xml={svg} width={size} height={size} />
            ) : (
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="small" color="#ec4899" />
                </View>
            )}
        </View>
    );
}

type TabType = 'face' | 'hair' | 'facial' | 'accessories' | 'clothing' | 'colors';

// Helper to migrate old configs
function migrateConfig(config: AvatarConfig | undefined): AvatarConfig {
    if (!config) return defaultAvatarConfig;
    const migrated = { ...config };
    // Migrate backgroundColor from array to string
    if (Array.isArray(migrated.backgroundColor)) {
        migrated.backgroundColor = migrated.backgroundColor[0] || "b6e3f4";
    }
    return migrated;
}

export default function AvatarBuilder({ visible, onClose, onSave, initialConfig }: AvatarBuilderProps) {
    const [config, setConfig] = useState<AvatarConfig>(() => migrateConfig(initialConfig));
    const [activeTab, setActiveTab] = useState<TabType>('face');

    // Reset config when modal opens with new initialConfig
    useEffect(() => {
        if (visible && initialConfig) {
            setConfig(migrateConfig(initialConfig));
        }
    }, [visible, initialConfig]);

    const updateConfig = (key: keyof AvatarConfig, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        onSave(config);
        onClose();
    };

    const generateRandomSeed = () => {
        const randomString = Math.random().toString(36).substring(2, 15);
        updateConfig('seed', randomString);
    };

    const renderOptionGrid = (
        title: string,
        options: string[],
        configKey: keyof AvatarConfig,
        allowNone: boolean = false
    ) => (
        <View className="mb-6">
            <Text className="text-gray-400 font-bold uppercase text-xs mb-3 tracking-widest px-1">{title}</Text>
            <View className="flex-row flex-wrap">
                {allowNone && (
                    <TouchableOpacity
                        onPress={() => updateConfig(configKey, "")}
                        className={`w-20 h-20 m-1 rounded-xl bg-gray-50 items-center justify-center border-2 ${!config[configKey] ? "border-pink-500 bg-pink-50" : "border-gray-200"}`}
                    >
                        <Text className="text-gray-400 font-bold text-xs uppercase">None</Text>
                    </TouchableOpacity>
                )}
                {options.map((opt) => (
                    <OptionPreview
                        key={opt}
                        optionKey={configKey}
                        value={opt}
                        currentConfig={config}
                        isSelected={config[configKey] === opt}
                        onSelect={() => updateConfig(configKey, opt)}
                    />
                ))}
            </View>
        </View>
    );

    const renderColorGrid = (title: string, colors: { name: string, hex: string }[], configKey: keyof AvatarConfig) => (
        <View className="mb-6">
            <Text className="text-gray-400 font-bold uppercase text-xs mb-3 tracking-widest px-1">{title}</Text>
            <View className="flex-row flex-wrap gap-2">
                {colors.map((color) => (
                    <TouchableOpacity
                        key={color.hex}
                        onPress={() => updateConfig(configKey, color.hex)}
                        className="items-center m-1"
                    >
                        <View
                            className={`w-12 h-12 rounded-full border-2 ${config[configKey] === color.hex ? "border-pink-500" : "border-gray-200"}`}
                            style={{ backgroundColor: `#${color.hex}` }}
                        />
                        <Text className="text-[10px] text-gray-500 mt-1">{color.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'face':
                return (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                        {renderOptionGrid("Eyes", EYES_OPTIONS, "eyes")}
                        {renderOptionGrid("Eyebrows", EYEBROWS_OPTIONS, "eyebrows")}
                        {renderOptionGrid("Mouth", MOUTH_OPTIONS, "mouth")}
                    </ScrollView>
                );

            case 'hair':
                return (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                        {renderOptionGrid("Hair Style", TOP_OPTIONS, "top")}
                        {renderColorGrid("Hair Color", HAIR_COLORS, "hairColor")}
                    </ScrollView>
                );

            case 'facial':
                return (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                        {renderOptionGrid("Facial Hair", FACIAL_HAIR_OPTIONS, "facialHair", true)}
                        {renderColorGrid("Facial Hair Color", HAIR_COLORS, "facialHairColor")}
                    </ScrollView>
                );

            case 'accessories':
                return (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                        {renderOptionGrid("Accessories", ACCESSORIES_OPTIONS, "accessories", true)}
                        {renderColorGrid("Accessory Color", COLORS_HEX, "accessoriesColor")}
                    </ScrollView>
                );

            case 'clothing':
                return (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                        {renderOptionGrid("Clothing", CLOTHING_OPTIONS, "clothing")}
                        {renderColorGrid("Clothing Color", COLORS_HEX, "clothingColor")}
                    </ScrollView>
                );

            case 'colors':
                return (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                        {renderColorGrid("Skin Color", SKIN_COLORS, "skinColor")}
                        {renderColorGrid("Background", BACKGROUND_COLORS, "backgroundColor")}
                    </ScrollView>
                );
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View className="flex-1 bg-white">
                <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                    <TouchableOpacity onPress={onClose} className="p-2">
                        <X size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-900">Avatar Builder</Text>
                    <TouchableOpacity onPress={handleSave} className="bg-pink-500 px-4 py-2 rounded-full">
                        <Check size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Main Preview with Randomize */}
                <View className="items-center py-6 bg-gray-50 border-b border-gray-100">
                    <View className="bg-white p-4 rounded-full shadow-sm border-2 border-white">
                        <AvatarPreview config={config} size={140} />
                    </View>
                    <TouchableOpacity
                        onPress={generateRandomSeed}
                        className="mt-3 bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm"
                    >
                        <Text className="text-gray-700 font-bold text-xs uppercase tracking-wide">Randomize</Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Navigation */}
                <View className="bg-white border-b border-gray-100">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                        {[
                            { id: 'face' as TabType, label: 'Face' },
                            { id: 'hair' as TabType, label: 'Hair' },
                            { id: 'facial' as TabType, label: 'Beard' },
                            { id: 'accessories' as TabType, label: 'Accessories' },
                            { id: 'clothing' as TabType, label: 'Outfit' },
                            { id: 'colors' as TabType, label: 'Colors' }
                        ].map((tab) => (
                            <TouchableOpacity
                                key={tab.id}
                                onPress={() => setActiveTab(tab.id)}
                                className={`px-4 py-4 border-b-2 mr-2 ${activeTab === tab.id ? "border-pink-500" : "border-transparent"}`}
                            >
                                <Text className={`font-bold text-sm ${activeTab === tab.id ? "text-pink-600" : "text-gray-400"}`}>
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Content Area - Scrollable Grid */}
                <View className="flex-1 bg-white pt-6 px-4">
                    {renderTabContent()}
                </View>
            </View>
        </Modal>
    );
}
