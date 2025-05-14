type PlantMetadata = {
    weeklyWaterMl: number;
    expectedHumidity: number;
};

export type PlantHealthResult = {
    score: number;
    issues: string[];
};

const evaluatePlantHealth = (
    actualRainMm: number,
    actualHumidity: number,
    plant: PlantMetadata
): PlantHealthResult => {
    const AREA_M2 = 0.1;

    // Convert rain to ml
    const rainWaterMl = actualRainMm * 1000 * AREA_M2;

    // Watering: Human already gives what’s needed. Rain is extra.
    const totalWaterMl = plant.weeklyWaterMl + rainWaterMl;
    const waterRatio = totalWaterMl / plant.weeklyWaterMl;

    const overwaterThreshold = 1.3;

    const waterScore = waterRatio <= overwaterThreshold
        ? 100
        : Math.max(100 - ((waterRatio - overwaterThreshold) * 100), 0);

    // Humidity: Human provides controlled expectedHumidity.
    // If environment pushes humidity **higher**, it may cause stress.
    const humidityExcess = actualHumidity - plant.expectedHumidity;
    const humidityScore = humidityExcess <= 5
        ? 100
        : Math.max(100 - ((humidityExcess - 5) / 10) * 100, 0);

    const score = Math.round((waterScore + humidityScore) / 2);

    const issues: string[] = [];

    if (rainWaterMl > plant.weeklyWaterMl * 0.3) issues.push("Overwatered");
    if (humidityExcess > 5) issues.push("High humidity");

    return { score, issues };
}

export default evaluatePlantHealth;