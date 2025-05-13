// Essentials
import * as admin from "firebase-admin";

// Utils
import { serverEnv } from "@/utils/env/serverEnv";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: serverEnv.FIREBASE_PROJECT_ID,
            clientEmail: serverEnv.FIREBASE_CLIENT_EMAIL,
            privateKey: serverEnv.FIREBASE_PRIVATE_KEY,
        }),
    });
}

// Modules
export const dbAdminAuth = admin.auth();
export const dbAdminFirestore = admin.firestore();

// Funcs
export const Increment = (value: number) => admin.firestore.FieldValue.increment(value);
export const NewItem = (item: any) => admin.firestore.FieldValue.arrayUnion(item);