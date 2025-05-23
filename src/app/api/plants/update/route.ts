// Essentials
import { NextRequest, NextResponse } from "next/server";

// Database
import { Timestamp } from "firebase-admin/firestore";
import { NewItem, dbAdminAuth, dbAdminFirestore } from "../../fbAdmin";

// Utils
import { nextErrorReturner } from "@/utils/error/errorReturner";

// Models
import { NewPlant } from "@/models/Plant";
import fetchGeocode from "@/utils/fetchGeocode";

interface BODY {
    idToken: string;
    formData: NewPlant;
    plantID: string;
}

export async function POST(req: NextRequest) {
    try {
        const {
            idToken,
            formData,
            plantID
        } = await req.json() as BODY;

        if (!idToken || !formData || !plantID) return NextResponse.json({ error: "Missing required fields." }, { status: 400 });

        const decodedToken = await dbAdminAuth.verifyIdToken(idToken);
        const userPlantsRef = dbAdminFirestore.collection("users").doc(decodedToken.uid).collection("plants").doc(plantID);

        const { latitude, longitude } = await fetchGeocode(formData.locationQuery);

        await userPlantsRef.update({
            "name": formData.name,
            "type": formData.type,
            "metadata": NewItem({
                weeklyWaterNeed: Number(formData.weeklyWaterNeed),
                expectedHumidity: Number(formData.expectedHumidity),
                createdAt: Timestamp.now()
            }),
            "locationQuery": formData.locationQuery,
            "location.latitude": latitude,
            "location.longitude": longitude,
        });

        return NextResponse.json({ success: "Success" }, { status: 200 });
    } catch (error: any) {
        if (error.code === "auth/argument-error") {
            return nextErrorReturner({
                message: "Error verifying idToken.",
                status: 400,
                headers: {
                    from: "plants_update",
                    key: "idToken"
                }
            }, 400);
        } else return nextErrorReturner(error, 400);
    }
}