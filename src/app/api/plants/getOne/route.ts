// Essentials
import { NextRequest, NextResponse } from "next/server";
import moment from "moment-timezone";

// Database
import { dbAdminAuth, dbAdminFirestore } from "../../fbAdmin";

// Models
import { Plant } from "@/models/Plant";

// Utils
import { nextErrorReturner } from "@/utils/error/errorReturner";
import evaluatePlantHealth from "@/utils/calc/evaluatePlantHealth";
import fetchWeatherInfo from "@/utils/fetchWearherInfo";
import { generatePlantHealthHistory } from "@/utils/calc/generatePlantHealthHistory";

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
        if (!fetchedPlantDoc.exists) return NextResponse.json({ error: "No plant has been found." }, { status: 404 });
        const plantData = fetchedPlantDoc.data() as Plant;

        const weatherData = await fetchWeatherInfo(
            {
                startDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
                endDate: moment().format("YYYY-MM-DD")
            },
            {
                latitude: plantData.location.latitude,
                longitude:  plantData.location.longitude
            }
        );

        const plantHealthToday = evaluatePlantHealth(weatherData.actualRainMm[7], weatherData.actualHumidity[7], {
            weeklyWaterMl: plantData.metadata[plantData.metadata.length - 1].weeklyWaterNeed,
            expectedHumidity: plantData.metadata[plantData.metadata.length - 1].expectedHumidity,
        });

        const plant = {
            id: fetchedPlantDoc.id,
            ...fetchedPlantDoc.data()
        } as Plant;

        const status = {
            today: {
                plantHealth: plantHealthToday,
                weather: {
                    actualRainMl: weatherData.actualRainMm[7] * 1000 * 0.1, // Convert MM to ML
                    actualHumidty: weatherData.actualHumidity[7]
                }
            },
            thisWeek: {
                plantHealth: generatePlantHealthHistory(plant, weatherData)
            }
        }

        return NextResponse.json({ plant, status }, { status: 200 });
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