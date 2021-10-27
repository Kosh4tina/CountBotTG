const {gameOptions, againOptions} =require('./options.js')

const TelegramAPI = require('node-telegram-bot-api')

const token = '2033203656:AAEHu9cQdmQzMaUlIej4xrO9wae_btBQT2Q';
const bot = new TelegramAPI(token, { polling: true } )

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!`);
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = async () => {

    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/game', description: 'Игра угадай цифру'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === '/start') {
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
                return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот CountBot`);
            }
            if (text === '/game') {
                return startGame(chatId);
            }
            return bot.sendMessage(chatId, 'NANI!)');
        } catch (e) {
            return bot.sendMessage(chatId, 'Произошла какая то ошибочка!)');
        }

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            await bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions);
        }
    })
}

start()