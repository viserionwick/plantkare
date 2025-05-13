"use client"
// Essentials
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Utils
import { clientEnv } from "./env/clientEnv";

const firebaseConfig = {
    apiKey: clientEnv.FIREBASE_API_KEY,
    authDomain: clientEnv.FIREBASE_AUTH_DOMAIN,
    projectId: clientEnv.FIREBASE_PROJECT_ID,
    storageBucket: clientEnv.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: clientEnv.FIREBASE_MESSAGING_SENDER_ID,
    appId: clientEnv.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const dbConnect = getFirestore(app);
export const dbAuth = getAuth(app);