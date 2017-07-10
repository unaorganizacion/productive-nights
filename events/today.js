// today.js
const sendMessage = require('../tools/sendMessage');
const todayOffers = require('../today-offers');

let event = function (userObject) {
  this.userObject = userObject;
};

event.prototype = {};

event.prototype.setDatastore = function (datastore) {
  this.datastore = datastore;
};

event.prototype.run = function () {
  //console.log("sending today event to", this.userObject.mId, this.datastore);
    todayOffers(this.datastore, this.userObject).then(posts => {
        console.log('Today offers posts', posts);
        sendMessage.sendObjectMessage(this.userObject.mId, {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: posts
                }
            }
        });
    }, () => {
        sendMessage.sendTextMessage(this.userObject.mId, 'No hay ofertas de hoy :) intenta más tarde.');
    });
};

module.exports = event;