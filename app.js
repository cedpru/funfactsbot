const ngrok = require('ngrok');
const fs = require('fs');
const restify = require('restify');
const skype = require('skype-sdk');

const botService = new skype.BotService({
    messaging: {
        botId: '28:<bot’s id="">',
        serverUrl : "https://apis.skype.com",
        requestTimeout : 15000,
        appId: "d261e989-3d98-41d6-b151-54ea57c53988",
        appSecret: "HOp3fAnFCPgSoPs7rMaqj8f"
    }
});

botService.on('contactAdded', (bot, data) => {
    bot.reply('Hello ' + data.fromDisplayName + '!', true);
});

botService.on('personalMessage', (bot, data) => {
    if (data.content == '!master') {
        bot.reply('Bonjour Maitre', true);
    } else {
        bot.reply('Hey ' + data.from + '. Thank you for your message: "'+ data.content + '".', true);    
    }
    console.log('Message recu: ' + data.content);
});

ngrok.connect(8080, function (err, url) {});
ngrok.once('connect', function (url) {
    console.log('ngrok to : ' + url)
});
const server = restify.createServer();
server.post('/v1/chat', skype.messagingHandler(botService));
const port = process.env.PORT || 8080;
server.listen(port);
console.log('Listening for incoming requests on port ' + port);