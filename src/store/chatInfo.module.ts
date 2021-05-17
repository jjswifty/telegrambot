import { StoreonModule } from 'storeon'
import { store } from './index'

export type ChatInfoState = {
    chatId: number | null
}

export type ChatInfoEvents = {
    'chatInfo/set/chatInfo': number 
}

export const chatInfoModule: StoreonModule<ChatInfoState, ChatInfoEvents> = store => {

    store.on('@init', () => ({
        chatId: null
    }))

    store.on('chatInfo/set/chatInfo', (state, event) => ({
        chatId: event
    }))

}

