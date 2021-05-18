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