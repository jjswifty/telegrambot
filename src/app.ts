import { sendMessageSafe } from './utils/messageUtils';
import { weatherApi, geocoderApi } from './api';
import TelegramBotAPI from 'node-telegram-bot-api'
import texts from './data/texts'
import { store } from './store';

const token = process.env.token as string

export const bot = new TelegramBotAPI(token, { polling: true })

bot.setMyCommands([
    { command: '/start', description: 'Стартуем...' },
    { command: '/commands', description: 'Что я могу.' },
    { command: '/weather', description: 'Узнать погоду по геолокации.' },
    { command: '/spotify', description: 'Получить мой плейлист музыки в спотифай.' },
])

const start = () => {

    const getWeather = async (latitude: number, longitude: number) => {
        return await weatherApi.getWeatherFromCoordinates(latitude, longitude)
    }

    const getLocation = async (latitude: number, longitude: number) => {
        return await geocoderApi.geocodeByCoordinates(latitude, longitude)
    }

    bot.on('message', async msg => {

        const dispatch = store.dispatch
        //const chatId = store.get().chatId

        dispatch('chatInfo/set/chatInfo', {
            chatId: msg.chat.id as number,
            fromId: msg.from?.id as number,
            messageId: msg.message_id as number
        })

        const msgText = msg.text as string
        const fromId = msg.from?.id as number
        const messageId = msg.message_id as number
        const getPreparedWeatherInfo = () => {

            const weatherNow = store.get().weather
            const location = store.get().userLocation.location

            return (!location || !weatherNow) ? (
                "🏙️" + location + "\n" +
                `
                    Температура сейчас - ${weatherNow.temp}°, ${weatherNow.temp === weatherNow.feels_like ? '' : `ощущается как ${weatherNow.feels_like}°,`}
                    погода - ${weatherNow.condition}, скорость ветра - ${weatherNow.wind_speed} м/c,
                    текущие дата и время: ${new Date().toLocaleString()}, твой часовой пояс - ${weatherNow.tzinfo}.
                `
                .replace(/\s+/g, ' ').trim()
            ) : 'Не смог определить температуру. Проверь данные.'
        }

        if (msgText === '/start') {
            return sendMessageSafe('Я - очередной бот написанный на Node.js ради развлечения и отправки всякой фигни. Чекай мои команды)')
        }

        if (msgText === '/spotify') {
            return sendMessageSafe('А у тебя хороший вкус) https://open.spotify.com/playlist/3hKkfOblZr3yJpsVEhKpNv?si=bc37f42a7ed944fa')
        }

        if (msgText === '/commands') {
            return sendMessageSafe(
                "🌕 /weather - узнать погоду в своем городе. Пример: /weather Москва \n" +
                "🎵 /spotify - получить мой плейлист в спотифай (если уж совсем нечего слушать) \n" +
                "🔧 /commands - получить этот список команд. \n" +
                "Так же можно просто отправить геолокацию (метку) и получить погоду по ней."
            )
        }

        if (msgText === '/imidiot') {
            return sendMessageSafe(texts[Math.ceil((Math.random() * texts.length + 1))])
        }

        if (msgText?.includes('/weather')) {
            const splittedMessage = msgText.split(' ')

            if (splittedMessage.length > 2) {
                return sendMessageSafe('Напиши ровно 1 слово после команды. Пример: /weather Москва')
            }

            if (splittedMessage.length > 1) {
                const coordinates = await geocoderApi.geocodeByCityName(splittedMessage[splittedMessage.length - 1])

                if (!coordinates) {
                    return sendMessageSafe('Ты в каких-то ебенях, либо пишешь херню. Stop it. Get some help.')
                }

                const { latitude, longitude } = coordinates
                const { location } = await getLocation(latitude, longitude)
                const { weatherNow, cityInfo, forecast } = await getWeather(latitude, longitude)

                dispatch('weatherInfo/set/userLocation', {
                    location,
                    latitude,
                    longitude
                })

                dispatch('weatherInfo/set/weather', {
                    ...weatherNow,
                    tzinfo: cityInfo.tzinfo.name
                })

                return sendMessageSafe(getPreparedWeatherInfo())
            }
            return sendMessageSafe('Отправь мне свое местоположение (геолокацию), либо напиши /weather твой город.')
        }

        if (msg.location) {
            const { weatherNow, cityInfo, forecast } = await getWeather(msg.location.latitude, msg.location.longitude)
            const { location } = await getLocation(msg.location.latitude, msg.location.longitude)

            dispatch('weatherInfo/set/userLocation', {
                location,
                latitude: msg.location.latitude,
                longitude: msg.location.longitude
            })

            dispatch('weatherInfo/set/weather', {
                ...weatherNow,
                tzinfo: cityInfo.tzinfo.name
            })

            return sendMessageSafe(getPreparedWeatherInfo())
        }

        return sendMessageSafe(Math.random() > 0.5 ?
            `Че за хрень, ${msg.from?.first_name} Я не понял. Список команд чекай.`
            : `Че несешь? Напиши что-то нормальное, чекни список команд.`
            , { disable_notification: true }
        )
    })
}

start()