const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

try {
    console.log("Calling getDefaultConfig...");
    const config = getDefaultConfig(__dirname);
    console.log("getDefaultConfig success");

    console.log("Calling withNativeWind...");
    const result = withNativeWind(config, { input: "./global.css" });
    console.log("withNativeWind success");
} catch (error) {
    console.error("Diagnostic Error:", error);
}
