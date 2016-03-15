if (!process.env.NODE_ENV) require('dotenv').config();

var express = require('express'),
    botkit = require('botkit'),
	moment = require('moment-timezone'),
	util = require('util'),
    trello = require('./modules/trello'),
    app = express();


var controller = botkit.slackbot({
    debug: false
});

var bot = controller.spawn({
    token: process.env.BOT_TOKEN
});

bot.startRTM((err) => {
    if (err) console.log(err);
});

var event_types = ['direct_mention', 'direct_message', 'mention', 'ambient'];

controller.hears(['daily goals'], event_types, (bot, message) => {
	bot.say({
		type: 'typing',
		channel: message.channel
	});

	trello.getGoals((goals) => {
		var attachment_fields = goals.map(function(goal, index) {
			return {
				"value": util.format('%s - %s', (index + 1).toString(), goal.name),
				"short": false
			}
		});

		var reply = {
						"attachments": [
							{
								"fallback": "Required plain-text summary of the attachment.",
								"color": "#36a64f",
								"title": util.format('Daily Goals for %s', moment.tz(goals[0].due, 'America/New_York').format('MM/DD/YYYY')),
								"fields": attachment_fields
							}
						]
					}

		bot.reply(message, reply);
	});
});

controller.hears(['create card'], 'mention', (bot, message) => {
	bot.startConversation(message, (err, convo) => {
		convo.ask('Is this a daily goal?', [
			{
				pattern: bot.utterances.yes,
				callback: function(response,convo) {
					convo.say({
						type: 'typing',
						channel: response.channel
					});

					convo.say('What is the goal?');
						convo.next();
				}
			},
			{
				callback: function(response, convo) {
					convo.say({
						type: 'typing',
						channel: response.channel
					});
					convo.say('What is the due date?');
					convo.next();
				}
			},
			{
				callback: function(response, convo) {
					convo.say({
						type: 'typing',
						channel: response.channel
					});
					convo.say('How many points is it worth?');
					convo.next();
				}
			},
			{
				callback: function(response, convo) {
					convo.say(response.text);
					convo.next();
				}
			}
		]);
	});
});

module.exports = app;
