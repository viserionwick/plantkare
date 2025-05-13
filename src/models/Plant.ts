// Models

import { Timestamp } from "@/types/timestamp";

export interface Plant {
    id: string;
    name: string;
    type: string;
    metadata: {
        weeklyWaterNeed: number;
        expectedHumidity: number;
        createdAt: Timestamp
    }[]
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// Login
export interface NewPlant extends Pick<Plant,
    "name" |
    "type"
> {
    weeklyWaterNeed: number;
    expectedHumidity: number;
};

export type NewPlantErrors = {
    [K in keyof NewPlant]: string;
};