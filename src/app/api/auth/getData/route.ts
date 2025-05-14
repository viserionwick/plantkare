// Essentials
import { NextRequest, NextResponse } from "next/server";

// Database
import { dbAdminAuth, dbAdminFirestore } from "../../fbAdmin";

// Models
import { UserDoc } from "@/models/User";

// Utils
import { nextErrorReturner } from "@/utils/error/errorReturner";

interface BODY {
    idToken: string;
    timezone: string;
    language: string;
    hour24Format: boolean;
}

export async function POST(req: NextRequest) {
    try {
        const { idToken } = await req.json() as BODY;

        if (!idToken) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        const decodedToken = await dbAdminAuth.verifyIdToken(idToken);
        const userDoc = await dbAdminFirestore.collection("users").doc(decodedToken.uid).get();

        if (!userDoc.exists) {
            return NextResponse.json({ error: "User data not found." }, { status: 404 });
        }

        let userData = userDoc.data() as UserDoc;

        return NextResponse.json({ user: userData }, { status: 200 });
    } catch (error: any) {
        if (error.code === "auth/argument-error") {
            return nextErrorReturner({
                message: "Error verifying idToken.",
                status: 400,
                headers: {
                    from: "auth_getData",
                    key: "idToken"
                }
            }, 400);
        } else return nextErrorReturner(error, 400);
    }
}