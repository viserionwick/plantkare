// Essentials
import { NextRequest, NextResponse } from "next/server";

// Database
import { dbAdminAuth, dbAdminFirestore } from "../../fbAdmin";

// Utils
import { nextErrorReturner } from "@/utils/error/errorReturner";

interface BODY {
    idToken: string;
}

export async function POST(req: NextRequest) {
    try {
        const { idToken } = await req.json() as BODY;

        if (!idToken) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        const decodedToken = await dbAdminAuth.verifyIdToken(idToken);
        const userDocRef = dbAdminFirestore.collection("users").doc(decodedToken.uid);

        const userDoc = await userDocRef.get();
        if (!userDoc.exists) {
            return NextResponse.json({ error: "User data not found." }, { status: 404 });
        }

        await userDocRef.delete();

        return NextResponse.json({ user: userDoc.data() }, { status: 200 });
    } catch (error: any) {
        if (error.code === "auth/argument-error") {
            return nextErrorReturner({
                message: "Error verifying idToken.",
                status: 400,
                headers: {
                    from: "signup",
                    key: "wrong"
                }
            }, 400);
        } else return nextErrorReturner(error, 400);
    }
}