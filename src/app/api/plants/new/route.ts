// Essentials
import { NextRequest, NextResponse } from "next/server";

// Database
import { Timestamp } from "firebase-admin/firestore";
import { dbAdminAuth, dbAdminFirestore } from "../../fbAdmin";

// Utils
import { nextErrorReturner } from "@/utils/error/errorReturner";
import fetchGeocode from "@/utils/fetchGeocode";

// Models
import { NewPlant, Plant } from "@/models/Plant";

interface BODY {
    idToken: string;
    formData: NewPlant;
}

export async function POST(req: NextRequest) {
    try {
        const {
            idToken,
            formData
        } = await req.json() as BODY;

        if (!idToken || !formData) return NextResponse.json({ error: "Missing required fields." }, { status: 400 });

        const decodedToken = await dbAdminAuth.verifyIdToken(idToken);
        const userPlantsRef = dbAdminFirestore.collection("users").doc(decodedToken.uid).collection("plants");

        const { latitude, longitude } = await fetchGeocode(formData.locationQuery);

        const newPlant: Plant = {
            name: formData.name,
            type: formData.type,
            metadata: [{
                weeklyWaterNeed: Number(formData.weeklyWaterNeed),
                expectedHumidity: Number(formData.expectedHumidity),
                createdAt: Timestamp.now()
            }],
            createdAt: Timestamp.now(),
            locationQuery: formData.locationQuery,
            location: {
                latitude,
                longitude
            }
        };

        await userPlantsRef.add(newPlant);

        return NextResponse.json({ success: "Success" }, { status: 200 });
    } catch (error: any) {
        if (error.code === "auth/argument-error") {
            return nextErrorReturner({
                message: "Error verifying idToken.",
                status: 400,
                headers: {
                    from: "plant_new",
                    key: "idToken"
                }
            }, 400);
        } else return nextErrorReturner(error, 400);
    }
}