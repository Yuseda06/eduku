import "dotenv/config";

export default {
  expo: {
    name: "eduku",
    slug: "eduku",
    version: "1.0.0",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    platforms: ["ios", "android", "web"],
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      newArchEnabled: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.yuseda06.eduku",
      newArchEnabled: true,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router", "expo-font"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "d6be8545-5f9f-496c-83b8-d4781c8d5510",
      },
      router: {
        origin: false,
      },
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OPENAI_ORGANIZATION: process.env.OPENAI_ORGANIZATION,
      OPENAI_PROJECT: process.env.OPENAI_PROJECT,
    },
  },
};
