import { StoreonModule } from 'storeon'
import { store } from './index'

export type weatherInfoState = {
    userLocation: string,
    weather: {

    }
}

export type weatherInfoEvents = {
    'weatherInfo/set/weather': {
        
    },
    'weatherInfo/set/userLocation': {
        
    }
}

export const weatherInfoModule: StoreonModule<weatherInfoState, weatherInfoEvents> = store => {

    store.on('@init', () => ({
        userLocation: '',
        weather: {},
    }))

    store.on('weatherInfo/set/userLocation', (state, event) => {

    })

    store.on('weatherInfo/set/weather', (state, event) => ({
        
    }))


}