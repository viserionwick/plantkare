// Essentials
import { NextRequest, NextResponse } from "next/server";

// Database
import { Timestamp } from "firebase-admin/firestore";
import { dbAdminAuth, dbAdminFirestore } from "../../fbAdmin";

// Utils
import { nextErrorReturner } from "@/utils/error/errorReturner";

// Models
import { Plant } from "@/models/Plant";

interface BODY {
    idToken: string;
    limit: number;
    nextCursor: {
        _seconds: number,
        _nanoseconds: number
    };
}

export async function POST(req: NextRequest) {
    try {
        const { idToken, limit, nextCursor } = await req.json() as BODY;

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

        const lastDoc = trimmedDocs[trimmedDocs.length - 1];
        const newNextCursor = lastDoc?.get("createdAt") ?? null;

        return NextResponse.json({
            plants,
            totalPlantsAmount,
            nextCursor: newNextCursor,
            hasMore,
        }, { status: 200 });
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