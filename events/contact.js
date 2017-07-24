/**
 * Created by andre on 1/07/17.
 */
 let botMessages = require('../messages/bot-msgs');
 const sendMessage = require('../tools/sendMessage');

let event = function (userObject) {
    this.userObject = userObject;
};

event.prototype = {};

event.prototype.setDatastore = function (datastore) {
    this.datastore = datastore;
};

event.prototype.run = function () {
   sendMessage.sendTextMessage(this.userObject.mId, botMessages.START_SENDING_OFFERS, [], function () {},
            [{
                "type": "postback",
                "title": botMessages.SEND_CONTACT,
                "url": "https://m.me/ferisreal/"
            }]);
        return;
};

module.exports = event;
