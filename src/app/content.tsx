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
import fetchGeocode from "@/utils/fetchGeocode";

interface PROPS {
  userSession: UserSession | "bot";
}

const CONTENT: NextPage<PROPS> = (/* { userSession } */) => {
  const test = async () => {
    try {
      const plantHealthToday = evaluatePlantHealth(290, 23.7, {
        weeklyWaterMl: 290,
        expectedHumidity: 23.7,
      });

      console.log("plantHealthToday: ", plantHealthToday);
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