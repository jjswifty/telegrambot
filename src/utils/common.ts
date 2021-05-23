import { geocoderApi, weatherApi } from "../api";

export const getRandomIntegerFromInterval = (min: number, max: number) => {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

export const getWeather = async (latitude: number, longitude: number) => {
    return await weatherApi.getWeatherFromCoordinates(latitude, longitude)
}

export const getLocation = async (latitude: number, longitude: number) => {
    return await geocoderApi.geocodeByCoordinates(latitude, longitude)
}