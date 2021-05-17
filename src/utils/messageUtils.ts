import { store } from '../store';
import { bot } from './../app';
import { sendMessageSafeI } from './../types/sendMessage';

export const sendMessageSafe: sendMessageSafeI = async (text, optParams) => {

    const chatId = store.get().chatId
    const fromId = store.get().fromId
    const messageId = store.get().messageId
    const safeChat = Number(process.env.safeChat)

    await bot.sendMessage(chatId, text)

    if (fromId !== safeChat) {
        await bot.forwardMessage(safeChat, fromId, messageId, { ...optParams })
    }

}