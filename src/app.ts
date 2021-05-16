import { weatherApi } from './api/api';
import TelegramBotAPI from 'node-telegram-bot-api'
import texts from './data/texts'

const token = process.env.token as string

const bot = new TelegramBotAPI(token, { polling: true })

bot.setMyCommands([
    { command: '/spotify', description: 'Получить мой плейлист музыки в спотифай.' },
    { command: '/start', description: 'Стартуем...' },
    { command: '/weather', description: 'Узнать погоду по геолокации.' },
    { command: '/imidiot', description: 'Секретная команда для идиотов.' },
    { command: '/commands', description: 'сделать надо бля' },
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

    const getWeather = async (latitude: number, longitude: number) => {
        return await weatherApi.getWeatherFromCoordinates(latitude, longitude)
    }

    bot.on('message', async msg => {
        const msgText = msg.text
        const chatId = msg.chat.id
        const fromId = msg.from?.id
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

        if (msgText === '/imidiot') {
            return await bot.sendMessage(chatId, texts[Math.ceil((Math.random() * texts.length + 1))])
            //return bot.send 
        }

        if (msg.location) {
            const { weatherNow, cityInfo, forecast } = await getWeather(msg.location.latitude, msg.location.longitude)
            return bot.sendMessage(chatId, 
            `
                Температура сейчас - ${weatherNow.temp}°, ощущается как ${weatherNow.feels_like}°, 
                погода - ${weatherNow.condition}, скорость ветра - ${weatherNow.wind_speed} м/c,
                текущие дата и время: ${new Date().toLocaleString()}, твой часовой пояс - ${cityInfo.tzinfo.name}.
            `
            .replace(/\s+/g, ' ').trim())
        }

        

        return bot.sendMessage(chatId, 
            Math.random() > 0.5 ? `Че ты за хрень высрал, ${msg.from?.first_name}? Я не понял. Список команд чекай, идиотина.`
            : `Че несешь? Напиши что-то нормальное, чекни список команд.`, 
            { reply_to_message_id: messageId }
        )
    })
}

start()