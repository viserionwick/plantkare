"use client"

// Essentials
import { NextPage } from "next";
import axios from "axios";

// Models
import { UserSession } from "@/models/User";

// Components
import Headline from "@/components/pages/Headline/Headline";

// Utils
import evaluatePlantHealth from "@/utils/calc/evaluatePlantHealth";
import fetchWeatherInfo from "@/utils/fetchWearherInfo";
import moment from "moment-timezone";
import { generatePlantHealthHistory } from "@/utils/calc/generatePlantHealthHistory";

interface PROPS {
  userSession: UserSession | "bot";
}

const CONTENT: NextPage<PROPS> = (/* { userSession } */) => {
  const test = async () => {
    const plant = {
      "id": "skgQNVJ3vI70p3AacBMu",
      "status": {
        "today": {
          "plantHealth": {
            "score": 100,
            "issues": []
          },
          "weather": {
            "actualRainMl": 0,
            "actualHumidty": 18.6
          }
        }
      },
      "name": "NASD",
      "type": "ASDASD",
      "createdAt": {
        "_seconds": 1747238721,
        "_nanoseconds": 94000000
      },
      "metadata": [
        {
          "weeklyWaterNeed": 3001,
          "expectedHumidity": 12,
          "createdAt": {
            "_seconds": 1747238721,
            "_nanoseconds": 94000000
          }
        },
        {
          "weeklyWaterNeed": 3001,
          "expectedHumidity": 20,
          "createdAt": {
            "_seconds": 1747238765,
            "_nanoseconds": 345000000
          }
        }
      ]
    }
    try {
      const weatherData = await fetchWeatherInfo(
        {
          startDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
          endDate: moment().format("YYYY-MM-DD")
        },
        {
          latitude: "37.7749",
          longitude: "-122.4194"
        }
      );

      const history = generatePlantHealthHistory(plant as any, weatherData);
      console.log("history: ", history);
    
    } catch (error: any) {
      console.log("error: ", error);
    }
  }
  return (
    <div className="p-Home">
      <Headline>Your Virtual Garden</Headline>
      <button onClick={test}>test</button>
    </div>
  )
}

export default CONTENT;