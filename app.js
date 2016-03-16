if (!process.env.NODE_ENV) require('dotenv').config();

var express = require('express'),
    botkit = require('botkit'),
	moment = require('moment-timezone'),
	util = require('util'),
	schedule = require('node-schedule'),
    trello = require('./modules/trello'),
    constants = require('./modules/constants'),
	chatter = require('./modules/chatter'),
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

var job = schedule.scheduleJob('* /5 * * * *', function() {
    chatter.poke(bot);
});

var event_types = ['direct_mention', 'direct_message', 'mention', 'ambient'];

controller.hears([constants.triggers.daily_goal], event_types, (bot, message) => {
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

controller.hears([constants.triggers.create_card], 'mention', (bot, message) => {
	bot.say({
		type: 'typing',
		channel: message.channel
	});
	bot.startConversation(message, askCardType);
});

askCardType = function(response, convo) {
	convo.ask(constants.questions.what_type_of_card, [
        {
            pattern: new RegExp(/^(Daily Goal|DAILY GOAL|daily goal)/i),
            callback: (response, convo) => {
                askDailyGoalName(response, convo);
                convo.next();
            }
        },
        {
            pattern: new RegExp(/^(PBI|pbi)/i),
            callback: (response, convo) => {
                askPbiGoalName(response, convo);
                convo.next();
            }
        }
    ]);

	convo.next();
}

askDailyGoalName = function(response, convo) {
	bot.say({
		type: 'typing',
		channel: response.channel
	});
	convo.ask(constants.questions.daily_goal.whats_the_name, (response, convo) => {
		askDailyGoalDueDate(response, convo);
		convo.next();
	});
}

askDailyGoalDueDate = function(response, convo) {
	bot.say({
		type: 'typing',
		channel: response.channel
	});
	convo.ask(constants.questions.daily_goal.when_is_it_due, (response, convo) => {
		askDailyGoalPointValue(response, convo);
		convo.next();
	});
}

askDailyGoalPointValue = function(response, convo) {
	bot.say({
		type: 'typing',
		channel: response.channel
	});
	convo.ask(constants.questions.daily_goal.how_many_points, (response, convo) => {
		finish(response, convo);
		convo.next();
	});
}

finish = function(response, convo) {
	bot.say({
		type: 'typing',
		channel: response.channel
	});
	var responses = convo.extractResponses();
	console.log(JSON.stringify(responses));
	convo.say('Good Bye!');
	convo.next();
}

module.exports = app;
