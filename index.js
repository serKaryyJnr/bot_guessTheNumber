const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options.js')
const token = '5704490253:AAGk8KjoMlmstTkjt7BbP51_edRiFN6i3MU'

const bot = new TelegramApi(token, {polling: true});

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!');
    const randomNumber = Math.floor( Math.random()*10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions);

}

const start = () => {
    bot.setMyCommands( [
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Угадай число!'},
    ])
    
    bot.on('message', async msg => {
        
    
        const text = msg.text;
        const chatId = msg.chat.id;
        console.log(msg)
    
        if (text === '/start') {
            await bot.sendSticker(chatId, 'http://s3.amazonaws.com/stickers.wiki/anime_stikery_kun_nyasticks/35656.512.webp');
            return bot.sendMessage(chatId, 'Добро пожаловать в телеграм бот Карого Сергея');
        }
        if (text === '/info') {
        return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
    }
        if(text ==='/game') {
            return startGame(chatId);

        }
        return bot.sendMessage(chatId,'Я тебя не понимаю, попробуй еще раз!)');
    })

    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data ==='/again') {
            return startGame (chatId);

        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению, ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
        
    })
}
start()

