// today.js
const sendMessage = require('../tools/sendMessage');

let event = function (userObject) {
  this.userObject = userObject;
};

event.prototype = {};

event.prototype.setDatastore = function (datastore) {
  this.datastore = datastore;
};

event.prototype.run = function () {
  //console.log("sending today event to", this.userObject.mId, this.datastore);
  sendMessage.sendObjectMessage(this.userObject.mId, {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: require('../today-offers')
      }
    }
  });
}

module.exports = event;