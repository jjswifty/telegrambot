import { sendMessageSafe, getPreparedWeatherInfo, sendDice, getNumberGame, generateInlineKeyboardFilledWithNumbers, editMessage, removeMessages, getInlineButton, getLocation, getWeather } from './utils';
import { weatherApi, geocoderApi } from './api';
import TelegramBotAPI from 'node-telegram-bot-api'
import texts from './data/texts'
import { store } from './store';

const token = process.env.token as string

export const bot = new TelegramBotAPI(token, { polling: true })

bot.setMyCommands([
    { command: '/commands', description: 'Что я могу.' },
    { command: '/weather', description: 'Узнать погоду по геолокации.' },
    { command: '/roll', description: 'Подбросить кубик.' },
    { command: '/numbergame', description: 'Отгадай число от 0 до 10.' }
])

const start = () => {

    bot.on('polling_error', error => console.log(error))

    bot.on('callback_query', async msg => {

        const messageId = msg.message?.message_id as number
        if (!messageId || !msg.message?.from?.id) return

        const dispatch = store.dispatch
        dispatch('chatInfo/set/chatInfo', {
            chatId: msg.message?.chat.id,
            fromId: msg.message?.from?.id,
            messageId
        })
        console.log(msg) // здесь диспатчить айди

        if (msg.data === 'reroll_dice') {
            return sendDice()
        }

        if (msg.data?.match(/^ReplayNumberGame/)) {
            const { conceivedNumber, reply_markup, text } = getNumberGame()
            dispatch('games/set/numberGameRandomNumber', { conceivedNumber })
            return editMessage(messageId, text, reply_markup)
        }

        if (msg.data?.match(/^NumberGame/)) {
            const isNumberRight = !!msg.data.includes('right')
            const replayButton = getInlineButton('Еще раз?', 'ReplayNumberGame')

            // + Редактируем текущее сообщение, изменяя markup на кнопку Еще раз, при нажатии на которую появится markup, и так по кругу

            if (isNumberRight) {
                return editMessage(messageId, `✅Верно! Загаданное число - ${store.get().conceivedNumber}.✅`, replayButton)
            }
            return editMessage(messageId, `❌Неверно! Я загадал ${store.get().conceivedNumber}.❌`, replayButton)
        }

    })
    

    bot.on('message', async msg => {

        const dispatch = store.dispatch
        const chatId = msg.chat.id as number
        const msgText = msg.text as string
        const fromId = msg.from?.id as number
        const userFirstName = msg.from?.first_name as string
        const messageId = msg.message_id as number

        dispatch('chatInfo/set/chatInfo', { chatId, fromId, messageId, })
        
        if (msgText === '/start') {
            return sendMessageSafe('Я - очередной бот написанный на Node.js ради развлечения и отправки всякой фигни. Чекай мои команды)')
        }

        if (msgText === '/commands') {
            return sendMessageSafe(
                "🌕 /weather - узнать погоду в своем городе. Пример: /weather Москва \n" +
                "🔧 /roll - подбросить кубик. \n" +
                "🔧 /numbergame - отгадай число от 0 до 9. \n" +
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
                    return sendMessageSafe('Ты в каких-то ебенях, либо пишешь херню. Пиши по примеру - пример: /weather Москва')
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

        if (msgText === '/roll') {
            return sendDice()
        }

        if (msgText === '/numbergame') {
            const { conceivedNumber, reply_markup, text } = getNumberGame()
            dispatch('games/set/numberGameRandomNumber', { conceivedNumber })
            return sendMessageSafe(text, {
                reply_markup
            })
        }

        return sendMessageSafe(Math.random() > 0.5 ?
            `Че за хрень, ${userFirstName}. Я не понял. Список команд чекай.`
            : `Че несешь, ${userFirstName}? Напиши что-то нормальное, чекни список команд.`
            , { disable_notification: true, reply_to_message_id: messageId }
        )
    })
}

start()