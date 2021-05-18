import { weatherInfoEvents, weatherInfoModule, weatherInfoState } from './weatherInfo.module';
import { ChatInfoEvents, chatInfoModule, ChatInfoState } from './chatInfo.module'

import { createStoreon } from 'storeon'

export type StoreState = ChatInfoState &
    weatherInfoState

export type StoreEvents = ChatInfoEvents &
    weatherInfoEvents

const store = createStoreon<StoreState, StoreEvents>([chatInfoModule, weatherInfoModule]);

//3(window as any).store = store

export {
    chatInfoModule,
    weatherInfoModule,
    store
}