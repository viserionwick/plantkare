// Essentials
import z from "zod";

const serverEnvSchema = z.object({
    /* FIREBASE */
    FIREBASE_PROJECT_ID: z.string().min(1),
    FIREBASE_PRIVATE_KEY: z.string().min(1),
    FIREBASE_CLIENT_EMAIL: z.string().min(1),
})

export const serverEnv = serverEnvSchema.parse({
    /* FIREBASE */
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
});