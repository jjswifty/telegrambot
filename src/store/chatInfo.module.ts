import { StoreonModule } from 'storeon'
import { store } from './index'

export type ChatInfoState = {
    chatId: number | string,
    fromId: number | string,
    messageId: number | string,
}

export type ChatInfoEvents = {
    'chatInfo/set/chatInfo': {
        chatId: number | string,
        fromId: number | string,
        messageId: number | string,
    }
}

export const chatInfoModule: StoreonModule<ChatInfoState, ChatInfoEvents> = store => {

    store.on('@init', () => ({
        chatId: '', 
        fromId: '',
        messageId: ''
    }))

    store.on('chatInfo/set/chatInfo', (state, event) => ({
        chatId: event.chatId,
        fromId: event.fromId,
        messageId: event.messageId
    }))

}

