// Essentials
import { NextRequest, NextResponse } from "next/server";

// Utils
import getSessionData from "@/utils/auth/getSessionData";

const authRedirect = async (req: NextRequest, redirectTo: string, checkOnline: boolean = true) => {
    const user = await getSessionData();    
    const host = req.headers.get("host");
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const origin = `${protocol}://${host}`;

    if ((checkOnline && user) || (!checkOnline && !user)) {
        return NextResponse.redirect(origin + redirectTo);
    }
}

export default authRedirect;