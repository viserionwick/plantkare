// Models
import { Plant } from "@/models/Plant";

// Utils
import evaluatePlantHealth, { PlantHealthResult } from "./evaluatePlantHealth";

export type PlantHealthHistory = {
    date: string;
    score: PlantHealthResult["score"];
    issues: PlantHealthResult["issues"]
}[];

export const generatePlantHealthHistory = (
    plant: Plant,
    weatherData: {
        actualRainMm: number[],
        actualHumidity: number[],
        weatherDates: string[]
    }
): PlantHealthHistory => {
    const chartData: PlantHealthHistory = [];

    weatherData.weatherDates.forEach((dateStr, i) => {
        const metadata = plant.metadata[plant.metadata.length - 1]

        if (!metadata) return;

        const healthResults = evaluatePlantHealth(
            weatherData.actualRainMm[i],
            weatherData.actualHumidity[i],
            {
                weeklyWaterMl: metadata.weeklyWaterNeed,
                expectedHumidity: metadata.expectedHumidity
            }
        );

        chartData.push({
            date: dateStr,
            score: healthResults.score,
            issues: healthResults.issues
        });
    });

    return chartData;
};