import { StoreonModule } from 'storeon'

export type weatherInfoState = {
    userLocation: {
        location: string,
        latitude: number,
        longitude: number,
    }
    weather: {
        temperature: number,
        feels_like: number,
        overcast: string,
        wind_speed: number,
        timeZone: string,
    }
}

export type weatherInfoEvents = {
    'weatherInfo/set/weather': {
        temperature: number,
        feels_like: number,
        overcast: string,
        wind_speed: number,
        timeZone: string,
    },
    'weatherInfo/set/userLocation': {
        location: string,
        latitude: number,
        longitude: number,
    },
}

export const weatherInfoModule: StoreonModule<weatherInfoState, weatherInfoEvents> = store => {

    store.on('@init', () => ({
        userLocation: {
            location: '',
            latitude: 0,
            longitude: 0,
        },
        weather: {
            feels_like: 0,
            temperature: 0,
            overcast: '',
            wind_speed: 0,
            timeZone: '',
        },
    }))

    store.on('weatherInfo/set/weather', (state, event) => ({
        weather: {
            ...event
        }
    }))

    store.on('weatherInfo/set/userLocation', (state, event) => ({
        userLocation: {
            ...event
        }
    }))

}