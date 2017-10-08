// today.js
const sendMessage = require('../tools/sendMessage');
const todayOffers = require('../today-offers');
let botMessages = require('../messages/bot-msgs');

let event = function (userObject) {
  this.userObject = userObject;
};

event.prototype = {};

event.prototype.setDatastore = function (datastore) {
  this.datastore = datastore;
};

event.prototype.run = function () {
  //console.log("sending today event to", this.userObject.mId, this.datastore);
    todayOffers(this.datastore, this.userObject).then(postsElements => {
        console.log('Today offers posts', postsElements);
        for (let posts of postsElements) {
            sendMessage.sendObjectMessage(this.userObject.mId, {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: posts
                    }
                }
            });
        }
    }, (e) => {
        console.error('No today offers error', e);
        sendMessage.sendTextMessage(this.userObject.mId, botMessages.WEEKLY_NO_POSTS, [], function(){},
                              [{
                                "type": "postback",
                                "title": botMessages.START_SENDING_OFFERS_BUTTON2,
                                "payload": "WEEKLY_PAYLOAD"
                              },
                              {
                                "type": "postback",
                                "title": "☝️ AGREGAR INTERESES",
                                "payload": "CATEGORIES_PAYLOAD"
                              }]);
    });
};

module.exports = event; 