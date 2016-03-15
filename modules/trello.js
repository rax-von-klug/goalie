var requestify = require('requestify'),
	util = require('util'),
	_ = require('lodash');

var Trello = function() {
	var public_key = process.env.TRELLO_PUBLIC_KEY,
		token = process.env.TRELLO_TOKEN,
		list_id = process.env.TRELLO_LIST_ID,
		url = util.format('https://api.trello.com/1/lists/%s/cards?key=%s&token=%s&fields=name,desc,due', list_id, public_key, token);

	this.getGoals = function(callback) {
		console.log('Trello - Get Goals - Start');
		requestify.get(url).then(function(response) {
			console.log('Trello - Get Goals - Success');
			return callback(response.getBody());
		}, function(err) {
            console.log(err.getBody());
        });
	}
}

module.exports = new Trello();
