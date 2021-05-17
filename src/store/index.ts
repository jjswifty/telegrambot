import { ChatInfoEvents, chatInfoModule, ChatInfoState } from './chatInfo.module'

import { createStoreon } from 'storeon'

export type StoreState = ChatInfoState //&
export type StoreEvents = ChatInfoEvents //&

const store = createStoreon<StoreState, StoreEvents>([chatInfoModule]);

//3(window as any).store = store

export {
    chatInfoModule,
    store
}