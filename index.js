const TelegramBotAPI = require('node-telegram-bot-api')
const weatherAPI = require('./api')
require('dotenv').config();

const token = process.env.token

const bot = new TelegramBotAPI(token, { polling: true })

bot.setMyCommands([
    { command: '/spotify', description: 'Получить мой плейлист музыки в спотифай.' },
    { command: '/start', description: 'Стартуем...' },
    { command: '/weather', description: 'Узнать погоду по геолокации.' }
])

const start = () => {

    //let chatId = 0
    //let fromId = 0
    //let messageId = 0

    //const sendMessage = async msg => {
    //    await bot.sendMessage(chatId, msg)
    //}

    //const forwardMessage = async msg => {
    //    await bot.forwardMessage(chatId, fromId, true, messageId)
    //}

    const getWeather = async (latitude, longitude) => {
        return await weatherAPI.getWeatherFromCoordinates(latitude, longitude)
    }
    

    bot.on('message', async msg => {
        const msgText = msg.text
        const chatId = msg.chat.id
        const fromId = msg.from.id
        const messageId = msg.message_id

        console.log(msg)

        if (msgText === '/start') {
            return bot.sendMessage(chatId, 'Я - очередной бот написанный на Node.js ради развлечения и отправки всякой фигни. Чекай мои команды)')
        }

        if (msgText === '/spotify') {
            return bot.sendMessage(chatId, 'А у тебя хороший вкус) https://open.spotify.com/playlist/3hKkfOblZr3yJpsVEhKpNv?si=bc37f42a7ed944fa')
        }

        if (msgText === '/commands') {
            return bot.sendMessage(chatId, 'потом')
        }

        if (msgText === '/weather') {
            return bot.sendMessage(chatId, 'Отправь мне свое местоположение (геолокацию).')
        }

        if (msg.location) {
            const weather = await getWeather(msg.location.latitude, msg.location.longitude)
            return bot.sendMessage(chatId, 
            `
                Температура сейчас - ${weather.weatherNow.temp}°, ощущается как ${weather.weatherNow.feels_like}°, 
                погода - ${weather.weatherNow.condition}, скорость ветра - ${weather.weatherNow.wind_speed} м/c,
                текущие дата и время: ${new Date().toLocaleString()}, твой часовой пояс - ${weather.cityInfo.tzinfo.name}.
            `
            .replace(/\s+/g, ' ').trim())
        }

        return bot.sendMessage(chatId, `Че ты за хрень написал, ${msg.from.first_name}? Я не понял. Список команд чекай, идиотина.`, {
            reply_to_message_id: messageId
        })
    })
}

start()