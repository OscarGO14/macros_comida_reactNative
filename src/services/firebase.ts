import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  where,
  query,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import { initializeAuth } from 'firebase/auth';
// @ts-expect-error la funcion getReactNativePersistence no esta tipada correctamente
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Collections } from '@/types/collections';
import { IUserStateData } from '@/types/user';

const {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} = Constants.expoConfig?.extra ?? {};

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Collections
const ingredientsCollection = collection(db, Collections.INGREDIENTS);
const usersCollection = collection(db, Collections.USERS);
const recipesCollection = collection(db, Collections.RECIPES);

// Legacy exports - now delegating to centralized services
// Import services here to avoid circular dependencies
import { UserService } from './userService';

// Auth
const getUserQuery = (uid: string) => UserService.getUser(uid);
const deleteUser = (uid: string) => UserService.deleteUser(uid);
const updateUser = (uid: string, data: Partial<IUserStateData>) => UserService.updateUser(uid, data);

export {
  app,
  db,
  auth,
  usersCollection,
  ingredientsCollection,
  recipesCollection,
  getUserQuery,
  deleteUser,
  updateUser,
};
