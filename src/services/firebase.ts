// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBY3wdDH2loAJdfS7qO4aKIbCv0USdPLo",
  authDomain: "macros-comida.firebaseapp.com",
  projectId: "macros-comida",
  storageBucket: "macros-comida.firebasestorage.app",
  messagingSenderId: "54277400407",
  appId: "1:54277400407:web:bd8f3501c1c9abbd510012",
  measurementId: "G-EF98VT5HBE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
