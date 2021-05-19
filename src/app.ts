import { sendMessageSafe, getPreparedWeatherInfo, sendDice, sendNumberGame, generateInlineKeyboardFilledWithNumbers, editBotMessage, removeMessages } from './utils';
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
    { command: '/numbergame', description: 'Отгадай число от 0 до 9.' }
])

const start = () => {

    bot.on('polling_error', error => console.log(error))

    const getWeather = async (latitude: number, longitude: number) => {
        return await weatherApi.getWeatherFromCoordinates(latitude, longitude)
    }

    const getLocation = async (latitude: number, longitude: number) => {
        return await geocoderApi.geocodeByCoordinates(latitude, longitude)
    }

    bot.on('callback_query', async msg => {

        const messageId = msg.message?.message_id
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
            removeMessages([messageId, messageId - 2])
            return sendNumberGame()
        }

        if (msg.data?.match(/^NumberGame/)) {
            const isNumberRight = !!msg.data.includes('right')
            const replayButton = JSON.stringify({
                inline_keyboard: [[
                    {
                        text: 'Еще раз?',
                        callback_data: 'ReplayNumberGame'
                    }
                ]]
            }) as any

            removeMessages([messageId])
            // Удаляем сообщение, высвечиваем новое с результатом игры, и кнопкой Еще раз?, при нажатии на которую удалятся сообщение с предыдущей игрой

            if (isNumberRight) {
                return sendMessageSafe(`✅Верно! Загаданное число - ${store.get().conceivedNumber}.✅`, { reply_markup: replayButton })
            }
            return sendMessageSafe(`❌Неверно! Я загадал ${store.get().conceivedNumber}.❌`, { reply_markup: replayButton })
        }

    })
    

    bot.on('message', async msg => {

        const dispatch = store.dispatch
        //const chatId = store.get().chatId

        const chatId = store.get().chatId as number
        const msgText = msg.text as string
        const fromId = msg.from?.id as number
        const userFirstName = msg.from?.first_name
        const messageId = msg.message_id as number

        dispatch('chatInfo/set/chatInfo', {
            chatId: msg.chat.id as number,
            fromId: msg.from?.id as number,
            messageId: msg.message_id as number
        })

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
            return sendNumberGame()
        }

        return sendMessageSafe(Math.random() > 0.5 ?
            `Че за хрень, ${msg.from?.first_name}. Я не понял. Список команд чекай.`
            : `Че несешь, ${msg.from?.first_name}? Напиши что-то нормальное, чекни список команд.`
            , { disable_notification: true, reply_to_message_id: messageId }
        )
    })
}

start()