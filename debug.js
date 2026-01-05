console.log("Start debug script");
console.log("Loading expo/metro-config...");
try {
    const { getDefaultConfig } = require("expo/metro-config");
    console.log("Loaded expo/metro-config");
} catch (e) {
    console.error("Failed to load expo/metro-config", e);
}

console.log("Loading nativewind/metro...");
try {
    const { withNativeWind } = require("nativewind/metro");
    console.log("Loaded nativewind/metro");
} catch (e) {
    console.error("Failed to load nativewind/metro", e);
}
console.log("End debug script");
