import { StoreonModule } from 'storeon'

export type weatherInfoState = {
    userLocation: {
        location: string,
        latitude: number,
        longitude: number,
    }
    weather: {
        temp: number,
        feels_like: number,
        condition: string,
        wind_speed: number,
        tzinfo: string,
    }
}

export type weatherInfoEvents = {
    'weatherInfo/set/weather': {
        temp: number,
        feels_like: number,
        condition: string,
        wind_speed: number,
        tzinfo: string,
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
            temp: 0,
            condition: '',
            wind_speed: 0,
            tzinfo: '',
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