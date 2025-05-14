// Essentials
import { NextRequest, NextResponse } from "next/server";

// Database
import { dbAdminAuth, dbAdminFirestore } from "../../fbAdmin";

// Utils
import { nextErrorReturner } from "@/utils/error/errorReturner";

interface BODY {
    idToken: string;
    plantID: string;
}

export async function POST(req: NextRequest) {
    try {
        const { idToken, plantID } = await req.json() as BODY;        

        if (!idToken || !plantID) return NextResponse.json({ error: "Missing required fields." }, { status: 400 });

        const decodedToken = await dbAdminAuth.verifyIdToken(idToken);
        const userPlantsRef = dbAdminFirestore
            .collection("users")
            .doc(decodedToken.uid)
            .collection("plants")
            .doc(plantID);

        const fetchedPlantDoc = await userPlantsRef.get();
        const plant = {
            id: fetchedPlantDoc.id,
            ...fetchedPlantDoc.data()
        };

        return NextResponse.json({ plant }, { status: 200 });
    } catch (error: any) {
        if (error.code === "auth/argument-error") {
            return nextErrorReturner({
                message: "Error verifying idToken.",
                status: 400,
                headers: {
                    from: "plants_getOne",
                    key: "idToken"
                }
            }, 400);
        } else return nextErrorReturner(error, 400);
    }
}