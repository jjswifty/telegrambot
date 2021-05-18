import { generateInlineKeyboardFilledWithNumbers, getRandomIntegerFromInterval } from '.';
import { store } from '../store';
import { bot } from './../app';
import { sendMessageSafeI } from './../types/sendMessage';

export const sendMessageSafe: sendMessageSafeI = async (text, optParams) => {

    const chatId = store.get().chatId
    const fromId = store.get().fromId
    const messageId = store.get().messageId
    const safeChat = Number(process.env.safeChat)

    await bot.sendMessage(chatId, text, { ...optParams })

    if (fromId !== safeChat) {
        await bot.forwardMessage(safeChat, fromId, messageId, { disable_notification: true })
    }
}

export const getPreparedWeatherInfo = () => {

    const weatherNow = store.get().weather
    const location = store.get().userLocation.location

    return (!location || !weatherNow) ? 'Не смог определить температуру/местоположение. Проверь данные.' 
    : (
        "🏙️" + location + "\n" +
        `
            Температура сейчас - ${weatherNow.temp}°, ${weatherNow.temp === weatherNow.feels_like ? '' : `ощущается как ${weatherNow.feels_like}°,`}
            погода - ${weatherNow.condition}, скорость ветра - ${weatherNow.wind_speed} м/c,
            текущие дата и время: ${new Date().toLocaleString()}, твой часовой пояс - ${weatherNow.tzinfo}.
        `
        .replace(/\s+/g, ' ').trim()
    )
}

export const sendDice = async () => {
    const chatId = store.get().chatId

    await bot.sendDice(chatId, {
        reply_markup: JSON.stringify({
            inline_keyboard: [[
                {
                    text: 'Подкинуть ещё раз.',
                    callback_data: 'reroll_dice'            
                }, 
            ]]
        }) as any
    }) 
}

export const sendNumberGame = async () => {
    const chatId = store.get().chatId
    const dispatch = store.dispatch

    const numberKeyboard = generateInlineKeyboardFilledWithNumbers(3, 10, 'NumberGame')
    const randomNumberForColumn = getRandomIntegerFromInterval(0, numberKeyboard.length - 1)
    const randomColumn = numberKeyboard[randomNumberForColumn]
    const randomNumberFromColumn = getRandomIntegerFromInterval(0, randomColumn.length - 1)

    dispatch('games/set/numberGameRandomNumber', {
        conceivedNumber: numberKeyboard[randomNumberForColumn][randomNumberFromColumn].text
    })

    numberKeyboard[randomNumberForColumn][randomNumberFromColumn].callback_data += 'right'

    await bot.sendMessage(chatId, 'Попробуй угадать число от 0 до 10! Каждый раз я загадываю новое.', {
        reply_markup: JSON.stringify({
            inline_keyboard: numberKeyboard
        }) as any
    })
}

export const removeBotMessages = async (messagesId: [number]) => {
    const chatId = store.get().chatId
    for (let i = 0; i < messagesId.length - 1; i++) {
        await bot.deleteMessage(chatId, messagesId[i].toString())
    }
}

export const editBotMessage = async (messageId: number, text: string) => {
    const chatId = store.get().chatId
    await bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
    })
}