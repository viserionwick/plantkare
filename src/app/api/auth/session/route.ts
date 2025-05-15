// Essentials
import { NextRequest, NextResponse } from "next/server";

// Models
import { UserSession } from "@/models/User";

// Utils
import { nextErrorReturner } from "@/utils/error/errorReturner";

interface BODY {
    userSession?: UserSession;
}

export async function POST(req: NextRequest) { // Create cookie.
    try {
        const { userSession } = await req.json() as BODY;        

        const expiresIn = 50 * 365.25 * 24 * 60 * 60 * 1000; // 50 years in milliseconds.
        const cookieMaxAge = expiresIn / 1000; // Convert to seconds for cookie maxAge.
        const successResponse = NextResponse.json({ success: true }, { status: 200 });

        // Create auth session.
        if (userSession === "auth") {
            successResponse.cookies.set("userSession", "auth", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: cookieMaxAge
            });
            return successResponse;
        }

        return NextResponse.json({ error: "Error creating session cookie." }, { status: 400 });
    } catch (error: any) {
        return nextErrorReturner(error);
    }
}

export async function DELETE() { // Delete cookie.
    try {
        const successResponse = NextResponse.json({ success: true }, { status: 200 });

        successResponse.cookies.set("userSession", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 0,
        });

        successResponse.cookies.set("isBot", "", {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 0,
        });

        return successResponse;
    } catch (error: any) {
        return nextErrorReturner(error);
    }
}