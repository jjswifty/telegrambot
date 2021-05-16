import { bot } from './../app';
import { sendMessageSafeI } from './../types/sendMessage';

export const sendMessageSafe: sendMessageSafeI = async (fromChatId, messageId, text, optParams) => {
    await bot.sendMessage(fromChatId, text)
    if (fromChatId !== Number(process.env.safeChat)) {
        console.log(fromChatId, process.env.safeChat)
        await bot.forwardMessage(process.env.safeChat as string, fromChatId, messageId, {
            ...optParams
        })
    }
    
}