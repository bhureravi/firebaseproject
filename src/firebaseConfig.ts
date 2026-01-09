// src/firebaseConfig.ts
// Firebase initializer - import this wherever you need auth or db

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// <-- paste your firebase config here (from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyCXD81VjExsYtrVHUJXq6OXutqCdG6hHfM",
  authDomain: "instichain.firebaseapp.com",
  projectId: "instichain",
  storageBucket: "instichain.firebasestorage.app",
  messagingSenderId: "463471983140",
  appId: "1:463471983140:web:e8901aceb0aea0ebbdf6b1",
  measurementId: "G-3V1QWKLW8H"
};

const app = initializeApp(firebaseConfig);

// exports you will use in the app
export const auth = getAuth(app);
export const db = getFirestore(app);
