// fbAdmin.ts
import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Utils
import { serverEnv } from "@/utils/env/serverEnv";

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert({
          projectId: serverEnv.FIREBASE_PROJECT_ID,
          clientEmail: serverEnv.FIREBASE_CLIENT_EMAIL,
          privateKey: serverEnv.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      })
    : getApp();

export const dbAdminAuth = getAuth(app);
export const dbAdminFirestore = getFirestore(app);

// Utils
export const Increment = (value: number) => FieldValue.increment(value);
export const NewItem = (item: any) => FieldValue.arrayUnion(item);