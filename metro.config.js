const os = require("os");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.maxWorkerCount = Math.max(1, os.cpus().length - 1);

module.exports = withNativeWind(config, {
  input: "./app/global.css",
  inlineRem: 16,
});
