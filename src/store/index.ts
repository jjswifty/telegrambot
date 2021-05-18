import { gamesModule, gamesEvents, gamesState } from './games.module';
import { weatherInfoEvents, weatherInfoModule, weatherInfoState } from './weatherInfo.module';
import { ChatInfoEvents, chatInfoModule, ChatInfoState } from './chatInfo.module'

import { createStoreon } from 'storeon'

export type StoreState = ChatInfoState &
    weatherInfoState &
    gamesState

export type StoreEvents = ChatInfoEvents &
    weatherInfoEvents &
    gamesEvents

const store = createStoreon<StoreState, StoreEvents>([chatInfoModule, weatherInfoModule, gamesModule]);

//3(window as any).store = store

export {
    chatInfoModule,
    weatherInfoModule,
    gamesModule,
    store
}