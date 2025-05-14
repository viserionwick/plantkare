// Essentials
import axios from "axios";

const fetchWeatherInfo = async (
    dates: {
        startDate: string,
        endDate: string
    },
    location: {
        latitude: string
        longitude: string
    }
) => {
    const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&start_date=${dates.startDate}&end_date=${dates.endDate}&timezone=auto`);
    const actualRainMm = response.data.daily.precipitation_sum as number[];
    const actualHumidity = response.data.daily.temperature_2m_max as number[];
    const weatherDates = response.data.daily.time as string[];

    return {
        actualRainMm,
        actualHumidity,
        weatherDates
    };
}

export default fetchWeatherInfo;