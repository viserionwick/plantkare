// Essentials
import { NextRequest, NextResponse } from "next/server";

// Types
import { ExecuteMiddlewares, Middleware } from "./types/middleware";

// Middlewares
import apiRouteCheck from "./middlewares/api/apiRouteCheck";
import authRedirect from "./middlewares/api/auth/authRedirect";

// Utils
import { checkBot } from "./utils/checkBot";
import { blockClient } from "./utils/auth/getSessionData";

const executeMiddlewares: ExecuteMiddlewares = async (req: NextRequest, allMiddlewares: Middleware[]) => {
    if (allMiddlewares.length) {
        for (let i = 0; i < allMiddlewares.length; i++) {
            const response = await allMiddlewares[i](req);
            if (response) return response;
        }
        return NextResponse.next();
    } else return;
}

export const middleware = async (req: NextRequest) => {
    const pathname = req.nextUrl.pathname;
    const isBot = await checkBot();

    // Middlewares for: APIs.
    if (pathname.startsWith("/api")) {
        const response = await executeMiddlewares(req, [
            apiRouteCheck
        ]);

        if (response) return response;
    }

    // Set session to be guest if client is a search engine bot.
    if (isBot) {
        const response = NextResponse.next();
        const expiresIn = 50 * 365.25 * 24 * 60 * 60 * 1000; // 50 years in milliseconds.
        const cookieMaxAge = expiresIn / 1000; // Convert to seconds for cookie maxAge.

        response.cookies.set("isBot", "true", {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: cookieMaxAge
        });

        return response;
    }

    // Redirect: non-bot clients to "/" or "/auth", depending on if the client has login session or not.
    if (blockClient && !isBot) {
        if (pathname.startsWith("/auth")) {
            const userToRedirect = await authRedirect(req, "/");
            if (userToRedirect) return userToRedirect;
        }
        if (pathname === "/") {
            const userToRedirect = await authRedirect(req, "/auth/signup", false);
            if (userToRedirect) return userToRedirect;
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/:path*"
    ],
}