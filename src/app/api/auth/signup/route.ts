// Essentials
import { NextRequest, NextResponse } from "next/server";

// Database
import { dbAdminAuth, dbAdminFirestore } from "../../fbAdmin";

// Utils
import { nextErrorReturner } from "@/utils/error/errorReturner";

// Models
import { UserDoc } from "@/models/User";
import { Timestamp } from "firebase-admin/firestore";

interface BODY {
    idToken: string;
    timezone: string;
    language: string;
    hour24Format: boolean;
}

export async function POST(req: NextRequest) {
    try {
        const {
            idToken,
            timezone,
            hour24Format,
        } = await req.json() as BODY;

        const decodedToken = await dbAdminAuth.verifyIdToken(idToken);

        const newUser: UserDoc = {
            email: decodedToken.email,
            timezone,
            hour24Format,
            createdAt: Timestamp.now()
        };

        await dbAdminFirestore.collection("users").doc(decodedToken.uid).set(newUser);

        return NextResponse.json({ success: newUser }, { status: 200 });
    } catch (error: any) {
        if (error.code === "auth/argument-error") {
            return nextErrorReturner({
                message: "Error verifying idToken.",
                status: 400,
                headers: {
                    from: "auth_signup",
                    key: "idToken"
                }
            }, 400);
        } else return nextErrorReturner(error, 400);
    }
}