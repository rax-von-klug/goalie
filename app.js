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

controller.hears(['create a card'], 'mention', (bot, message) => {
	bot.startConversation(message, askCardType);
});

askCardType = function(response, convo) {
	console.log(JSON.stringify(response));
	convo.say({
		type: 'typing',
		channel: response.channel
	});

	convo.say('Is this a daily goal?');
	askGoalName(response, convo);

	convo.next();
}

askGoalName = function(response, convo) {
	convo.say({
		type: 'typing',
		channel: response.channel
	});
	convo.say('What is the name of the goal?');
	askDueDate(response, convo);
	convo.next();
}

askDueDate = function(response, convo) {
	convo.say({
		type: 'typing',
		channel: response.channel
	});
	convo.say('What is the due date of the goal?');
	askPointValue(response, convo);
	convo.next();
}

askPointValue = function(response, convo) {
	convo.say({
		type: 'typing',
		channel: response.channel
	});
	convo.say('How many points is the goal worth?');
	finish(response, convo);
	convo.next();
}

finish = function(response, convo) {
	convo.say({
		type: 'typing',
		channel: response.channel
	});

	var responses = convo.extractResponses();
	console.log(JSON.stringify(responses));
	convo.say('Good Bye!');
	convo.next();
}

module.exports = app;
