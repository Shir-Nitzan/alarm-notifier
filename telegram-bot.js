const learn = require('./learn')
const TeleBot = require('telebot');
const bot = new TeleBot('1891616916:AAGcB_RsSUV53b_MfS5lrxPsfepkmrHthnY');
let userLocation = null

bot.on(['/start', '/hello'], (msg) => msg.reply.text('Welcome,\nI will send you a message when a red alert sounds.' +
    '\nEnter your city name in the format <city: \'תל אביב\'>'));

bot.on([/^(city).+/], (msg) => {
    console.log(typeof msg, 'type')
    // Hebrew strings received as reversed.
    userLocation = msg.text.toString().split('').reverse().join('');
    console.log(typeof userLocation, 'typeof userLocation')
    let processedLoc =  userLocation.replace(":", "").split(" ")[0];

    console.log(processedLoc, 'processedLoc')


    msg.reply.text('location accepted,\nTo show history of red colored places press send \'history\'')
});
async function getMsgHistory(msg)  {
    let historyAlarmPlaces = await learn.invokeHistoryServer();
    console.log(historyAlarmPlaces, 'historyAlarmPlaces')

    msg.reply.text(historyAlarmPlaces, ' showing history aparm places\'');
}

    bot.on([/^(history)/], (msg) => getMsgHistory(msg))



bot.start();
