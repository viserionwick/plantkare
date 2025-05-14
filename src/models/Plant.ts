// Models

import { Timestamp } from "@/types/timestamp";
import { PlantHealthResult } from "@/utils/calc/evaluatePlantHealth";
import { PlantHealthHistory } from "@/utils/calc/generatePlantHealthHistory";

export interface Plant {
    id?: string;
    plantHealthToday?: PlantHealthResult;
    name: string;
    type: string;
    metadata: {
        weeklyWaterNeed: number;
        expectedHumidity: number;
        createdAt: Timestamp
    }[]
    createdAt: Timestamp;
    locationQuery: string;
    location: {
        latitude: string,
        longitude: string
    }
}

export interface NewPlant extends Pick<Plant,
    "name" |
    "type" |
    "locationQuery"
> {
    weeklyWaterNeed: number;
    expectedHumidity: number;
};

export type NewPlantErrors = {
    [K in keyof NewPlant]: string;
};

export interface UpdatePlant extends NewPlant {
    plantID: string;
};

export interface PlantStatus {
    today: {
        plantHealth: PlantHealthResult,
        weather: {
            actualRainMl: number
            actualHumidty: number
        }
    },
    thisWeek: {
        plantHealth: PlantHealthHistory
    }
};