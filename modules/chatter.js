var Chatter = function() {

    this.poke = function(bot) {
        bot.api.chat.postMessage({
            text: ':stand_up: Stand up time! Update trello and vsts :stand_up:',
            channel: 'C0GB1N91V',
            as_user: true
        });
    };
};

module.exports = new Chatter();
