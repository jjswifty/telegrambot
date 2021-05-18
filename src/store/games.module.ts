import { StoreonModule } from 'storeon'

export type gamesState = {
    conceivedNumber: number | null
}

export type gamesEvents = {
    'games/set/numberGameRandomNumber': {
        conceivedNumber: number
    }
}

export const gamesModule: StoreonModule<gamesState, gamesEvents> = store => {

    store.on('@init', () => ({
        conceivedNumber: null
    }))

    store.on('games/set/numberGameRandomNumber', (state, event) => ({
        ...event
    }))

}
