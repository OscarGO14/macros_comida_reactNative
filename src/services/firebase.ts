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

// Auth
const getUserQuery = async (uid: string) => {
  try {
    const q = query(usersCollection, where('uid', '==', uid));
    const snapshot = await getDocs(q);
    if (snapshot.docs.length > 0) {
      return snapshot.docs[0].data() as IUserStateData;
    }
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
  }
  return null;
};
const deleteUser = async (uid: string) => {
  try {
    const userDoc = doc(db, 'users', uid);
    await deleteDoc(userDoc);
    console.log('Usuario eliminado exitosamente');
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
  }
};
const updateUser = async (uid: string, data: Partial<IUserStateData>) => {
  try {
    const userDoc = doc(db, Collections.USERS, uid);
    await updateDoc(userDoc, data);
    console.log('Usuario actualizado exitosamente');
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
  }
};

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
