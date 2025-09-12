const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
// Ensure .cjs is included to let Metro resolve Firebase package CJS files
config.resolver.sourceExts = config.resolver.sourceExts || [];
if (!config.resolver.sourceExts.includes('cjs')) {
  config.resolver.sourceExts.push('cjs');
}

// Optionally, if you hit package-exports resolution problems, you can disable packageExports:
config.resolver.unstable_enablePackageExports = false;


module.exports = withNativeWind(config, { input: "./global.css" });
