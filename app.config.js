import 'dotenv/config';

export default {
  expo: {
    name: 'macros-comida',
    slug: 'macros-comida',
    version: '1.1.0',
    orientation: 'portrait',
    icon: './assets/icons/motivacion-64.png',
    userInterfaceStyle: 'dark',
    splash: {
      image: './assets/icons/motivacion-64.png',
      resizeMode: 'contain',
      backgroundColor: '#181920',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/icons/motivacion-64.png',
        backgroundColor: '#181920',
      },
    },
    web: {
      favicon: './assets/icons/motivacion-16.png',
      bundler: 'metro',
      output: 'static',
      display: 'standalone',
    },
    extra: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
      eas: {
        projectId: '61a47397-85d0-428a-a125-3e84a58547c8',
      },
    },
    plugins: ['expo-router'],
  },
};
