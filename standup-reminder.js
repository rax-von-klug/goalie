var botkit = require('botkit'),
	chatter = require('./modules/chatter');

var controller = botkit.slackbot({
    debug: false
});

var bot = controller.spawn({
    token: process.env.BOT_TOKEN
});

bot.startRTM((err) => {
    if (err) console.log(err);
});

chatter.poke(bot);
