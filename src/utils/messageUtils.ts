import { bot } from './../app';
import { sendMessageSafeI } from './../types/sendMessage';

export const sendMessageSafe: sendMessageSafeI = async (text, optParams) => {

    
    //const chatId = await bot.get
    //await bot.sendMessage(, text, { reply_to_message_id: messageId })
    //if (fromChatId !== Number(process.env.safeChat)) {
    //    console.log(fromChatId, process.env.safeChat)
    //    await bot.forwardMessage(process.env.safeChat as string, fromChatId, messageId, {
    //        ...optParams
    //    })
    //}
    //
}