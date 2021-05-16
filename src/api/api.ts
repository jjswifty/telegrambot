import axios from 'axios'
require('dotenv').config();

const weatherInstance = axios.create({
    baseURL: 'https://api.weather.yandex.ru/v2/',
    headers: {
        'X-Yandex-API-Key': process.env.weatherToken
    }
});

class WeatherAPI {
    getWeatherFromCoordinates = async (latitude: number, longitude: number) => {
        try {
            const { data } = await weatherInstance.get(`forecast?lat=${latitude}&lon=${longitude}&lang=ru_RU&limit=1`)

            return {
                cityInfo: data.info,
                weatherNow: data.fact,
                forecast: data.forecast,
            }
        } catch (err) {
            throw new Error(err)
        }
    }
}

export const weatherApi = new WeatherAPI()