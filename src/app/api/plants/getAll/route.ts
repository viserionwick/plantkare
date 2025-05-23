// Essentials
import { NextRequest, NextResponse } from "next/server";
import moment from "moment-timezone";

// Database
import { Timestamp } from "firebase-admin/firestore";
import { dbAdminAuth, dbAdminFirestore } from "../../fbAdmin";

// Utils
import { nextErrorReturner } from "@/utils/error/errorReturner";
import evaluatePlantHealth from "@/utils/calc/evaluatePlantHealth";
import fetchWeatherInfo from "@/utils/fetchWearherInfo";

// Models
import { Plant } from "@/models/Plant";

interface BODY {
    idToken: string;
    limit: number;
    nextCursor: {
        _seconds: number;
        _nanoseconds: number;
    };
    getAllAverageHealth?: boolean;
}

export async function POST(req: NextRequest) {
    try {
        const { idToken, limit, nextCursor, getAllAverageHealth } = await req.json() as BODY;

        if (!idToken || !limit) return NextResponse.json({ error: "Missing required fields." }, { status: 400 });

        const decodedToken = await dbAdminAuth.verifyIdToken(idToken);
        const userPlantsRef = dbAdminFirestore
            .collection("users")
            .doc(decodedToken.uid)
            .collection("plants")
            .orderBy("createdAt", "desc");

        let queryRef = userPlantsRef;
        let limitQueryRef = queryRef.limit(limit + 1);
        let paginatedQuery = limitQueryRef;
        let totalPlantsAmount: null | number = null;

        if (nextCursor) {
            const startAfterTimestamp = new Timestamp(nextCursor._seconds, nextCursor._nanoseconds);
            paginatedQuery = paginatedQuery.startAfter(startAfterTimestamp);
        } else {
            const plantsSnapshot = await queryRef.get();
            totalPlantsAmount = plantsSnapshot.size;
        }

        const plantsSnapshot = await paginatedQuery.get();
        const hasMore = plantsSnapshot.docs.length > limit;

        const trimmedDocs = hasMore
            ? plantsSnapshot.docs.slice(0, limit)
            : plantsSnapshot.docs;

        const plants = trimmedDocs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
        })) as Plant[];

        const plantsWithStatus = await Promise.all(
            plants.map(async (plant) => {
                const weatherData = await fetchWeatherInfo(
                    {
                        startDate: moment().format("YYYY-MM-DD"),
                        endDate: moment().format("YYYY-MM-DD")
                    },
                    {
                        latitude: plant.location.latitude,
                        longitude: plant.location.longitude
                    }
                );

                const plantHealthToday = evaluatePlantHealth(
                    weatherData.actualRainMm[0],
                    weatherData.actualHumidity[0],
                    {
                        weeklyWaterMl: plant.metadata[plant.metadata.length - 1].weeklyWaterNeed,
                        expectedHumidity: plant.metadata[plant.metadata.length - 1].expectedHumidity,
                    }
                );

                return {
                    plantHealthToday,
                    ...plant
                };
            })
        );

        const lastDoc = trimmedDocs[trimmedDocs.length - 1];
        const newNextCursor = lastDoc?.get("createdAt") ?? null;

        let allAverageHealth: number | null = null;
        if (getAllAverageHealth) {
            const allPlantsSnapshot = await userPlantsRef.get();

            const allPlants = allPlantsSnapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data(),
            })) as Plant[];

            const allPlantsWithStatus = await Promise.all(
                allPlants.map(async (plant) => {
                    const weatherData = await fetchWeatherInfo(
                        {
                            startDate: moment().format("YYYY-MM-DD"),
                            endDate: moment().format("YYYY-MM-DD")
                        },
                        {
                            latitude: plant.location.latitude,
                            longitude: plant.location.longitude
                        }
                    );

                    const plantHealthToday = evaluatePlantHealth(
                        weatherData.actualRainMm[0],
                        weatherData.actualHumidity[0],
                        {
                            weeklyWaterMl: plant.metadata[plant.metadata.length - 1].weeklyWaterNeed,
                            expectedHumidity: plant.metadata[plant.metadata.length - 1].expectedHumidity,
                        }
                    );

                    return plantHealthToday.score;
                })
            );

            const totalScore = allPlantsWithStatus.reduce((sum, score) => sum + score, 0);
            allAverageHealth = allPlantsWithStatus.length > 0
                ? totalScore / allPlantsWithStatus.length
                : 0;
        }

        return NextResponse.json({
            plants: plantsWithStatus,
            totalPlantsAmount,
            nextCursor: newNextCursor,
            hasMore,
            allAverageHealth,
        }, { status: 200 });
    } catch (error: any) {
        if (error.code === "auth/argument-error") {
            return nextErrorReturner({
                message: "Error verifying idToken.",
                status: 400,
                headers: {
                    from: "plant_getAll",
                    key: "idToken"
                }
            }, 400);
        } else return nextErrorReturner(error, 400);
    }
}