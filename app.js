if (!process.env.NODE_ENV) require('dotenv').config();

var express = require('express'),
    botkit = require('botkit'),
    trello = require('./modules/trello'),
    app = express();
    
var controller = botkit.slackbot({
    debug: false
});

var bot = controller.spawn({
    token: process.env.BOT_TOKEN
});

bot.startRTM((err) => {
    if (err) throw err;
});

var event_types = ['direct_mention', 'direct_message'];

controller.hears(['daily goals'], event_types, (bot, message) => {
    trello.getGoals(bot, message.channel);    
});

module.exports = app;