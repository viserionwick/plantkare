// Essentials
import { NextResponse, NextRequest } from "next/server";

// Types
import { Middleware } from "@/types/middleware";

const apiRouteCheck: Middleware = async (req: NextRequest) => {
    const pathname: string = req.nextUrl.pathname;
    const blockedRoutes = [
        "/api",
        "/api/auth"
    ]

    if (blockedRoutes.includes(pathname)) // Checks blacklist routes and non-route folders.
        return NextResponse.json({ error: "Access denied." }, { status: 405 });
};

export default apiRouteCheck;