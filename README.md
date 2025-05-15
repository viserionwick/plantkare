### 🧱 BUILT WITH

This project was built using these technologies:

- **Next.js** (with app folder routing)
- **TypeScript** (for type safe development)
- **React Context** (for state management)
- **RechartsJS** (for charts)
- **Radix-UI** (for customizable UI components)
- **SASS** (for custom styling)
- **Firebase** (as the database)


### ✨ FEATURES

- **Next.js App Folder**: Utilized Next.js app folder for efficient routing and page setup.
- **Radix-UI Components**: Integrated Radix-UI for accessible, customizable UI components, with SASS for custom styling.
- **State Management**: Implemented React Context for managing app-wide state efficiently.
- **Models**: Defined TypeScript models to ensure type-safe environment.
- **Validators**: Defined modular form input validators for the models.
- **Middleware Implementations**:
  - **Route Protection**: Middleware that denies access to pages that require session except for search engines.


### 🥀 HEALTH CALCULATION
The `evaluatePlantHealth` function calculates how healthy a plant is based on **real-world weather conditions** and the plant's **expected environment**.

#### Assumptions
- The plant is *already receiving* its **ideal weekly water need** from the human.
- The **real rain** and **real humidity** are *uncontrolled environmental* factors and may **ONLY negatively affect** the plant if they exceed expectations.
- The plant is assumed to be growing in a **0.1 m²** area for rain-to-water conversion.
- Health is a percentage from `0` (danger) to `100` (healthy).

#### FUNCTION:
```typescript
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
```

#### 💧 Water Calculation
Rain (in mm) is converted to ml using the formula:

`rainWaterMl = actualRainMm * 1000 * 0.1`

The total water the plant receives is:

`totalWaterMl = weeklyWaterMl + rainWaterMl`

Since the weekly water is already provided, any extra from rain is considered a risk of overwatering.
If the total water exceeds 130% of weeklyWaterMl, the health score is reduced proportionally.

#### 🌫️ Humidity Calculation
If the actual humidity is higher than expected by more than 5%, the plant may experience stress.
For every 10% beyond the 5% buffer, the score drops significantly:

`humidityScore = 100 - ((humidityExcess - 5) / 10) * 100
`

If actual humidity is below expected, it's assumed the human is correcting it.

#### 🧪 Result: Score and Issues

The final health score is the average of water and humidity scores, rounded to the nearest integer.

All issues:

- `Overwatered`: if rain alone is more than 30% of weekly water need.

- `High humidity`: if humidity exceeds expected by more than 5%.


#### Example
- **Name**: *Fiona*
- **Type**: *Fiddle Leaf Fig*
- **Weekly Water Need**: 1200ml
- **Expected Humidity**: 50%
- **Today's Weather**: Rain: 5.5mm — Humidity: 56.5%
- **HEALTH**: 84%

The function assumes the human is providing the plant's full weekly water need (*1200ml*).
The **real rain adds an extra** *550ml* (5.5mm × 1000 × 0.1m²). This brings the total to *1750ml*, which is about **1.46x** the needed amount. Since that's over the **1.3** threshold, the plant is slightly **overwatered**.

Similarly, the **humidity** is *56.5%*, which is *6.5%* higher than expected. Anything more than *5%* causes some stress. So the plant has **high humidity**.

Function returns:
- **Water Score**: 84
- **Humidity Score**: 85
- **Health Score**: (84 + 85) / 2 = ***84%***
- **Issues**: `["Overwatered", "High humidity"]`



### 📊 HEALTH HISTORY CHART

The `generatePlantHealthHistory` function maps the plant health scores using **weather data** between the **ranged dates** by comparing each day's weather to current day's health score for the plant.

#### FUNCTION:
```typescript
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
```

By utilizing **RechartsJS** I was able to display this mapping on the UI with a **line chart**:

```react
<ResponsiveContainer className="p-Plant--healthHistoryChart">
  <LineChart data={plantHistory!}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip
      content={formatHistoryTooltip}
    />
    <Legend />
    <Line type="monotone" dataKey="score" name="Health Percentage" stroke="var(--primaryColor)" />
  </LineChart>
</ResponsiveContainer>
```

By formatting the tooltip I was able to display each day's issues.
By utilizing **RechartsJS** I was able to display this mapping on the UI with a **line chart**:

```
2025-05-09
Health: 71%
Issues: Overwatered
```

### 🌦️ Real Weather Info Fetch
By utilizing [**Open Meteo**](https://open-meteo.com)'s free api I was able to get real rain and humidity. Location of said weather is provided by the user's `Location` input by converting the text address with another API called [**OpenCage Geocoding API**](https://opencagedata.com) into provided `latitude` and `longitude` geographic coordinates.


# The Project
This project was deployed on **Vercel** by utilizing **Git** and **GitHub**. You can access the demo by going to [plantkare-phi.vercel.app](https://plantkare-phi.vercel.app/).
## Folder Structure
By making the best out of what **NextJS** can offer from `Server` and `Client` side rendering I was able to implement **SEO** and **crawler/session** checks for each page.


```
.
├── 📁src
.   ├── 📁app
    .   ├── 📁page-name		# Each page has a folder.
        .   ├── page.tsx	# Server side rendered file.
            ├── content.tsx	# Client side rendered file.
            .
```

## Middleware
The middleware prevents clients from accessing **restricted pages** if the client doesn't have a session. Only exception is made for **search engine crawlers**. Crawlers can access each page but only be able to consume *non-private* data since there is no connection to the database.

## State Management
By utilizing **React Context** the states can be distributed throughout the client side with a *hook*.

In the `Auth Context` there are also authentication functions that are being distributed.

## Theme
By utilizing **SASS** the whole project can have light/dark theme alongside any other color themes. In this current state there is only light theme but the infrustruction is already there for the upgrade.
```
.
├── 📁src
.   ├── 📁styles
    .   ├── 📁themes		# Contains variable theme palettes.
        .   ├── light.scss	# Default palette.
            ├── dark.scss	# Empty palette ready to be updated.
            .
```


### 🚀 HOW TO RUN THIS PROJECT ON YOUR COMPUTER
To get this project up and running on your local machine, follow these steps:

1. **Prerequisites**:
   Ensure you have the following installed on your computer:
   - **Node.js** (version 14.x or later) – [Download Node.js](https://nodejs.org/)
   - **Git** – [Download Git](https://git-scm.com/)
    - **Firebase Firestore** – [Firestore Docs](https://firebase.google.com/docs/firestore)
    - **Firebase Authentication** (Email/Password) – [Firebase Auth Docs](https://firebase.google.com/docs/auth)

2. **Clone the Repository**:
   Open your terminal or command prompt and run the following command to clone the repository to the folder that you're currently in:
   ```bash
   git clone https://github.com/viserionwick/plantkare.git
   ```
3. **Navigate to the Project Directory:** Change to the project directory using:
   ```bash
   cd your-repository
   ```
4. **Install Dependencies:** Install the required dependencies using your preferred package manager:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```
5. **Set Up Environment Variables:** Create a `.env.local` file in the root directory and add the necessary environment variables:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   FIREBASE_PROJECT_ID=
   FIREBASE_PRIVATE_KEY=
   FIREBASE_CLIENT_EMAIL=
   ```
   You can find the keys in your **Firebase** project settings.
6. **Run the Development Server:** Start the development server with:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```
7. **Open the Application:** Once the server is running, open your web browser and go to: [http://localhost:3000](http://localhost:3000)