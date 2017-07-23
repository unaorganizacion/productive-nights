// share.js
const Promise = require("bluebird");
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
  let self = this;
  sendMessage.sendAPI({
                          recipient: { id: self.userObject.mId },
                          message: {
                              attachment: {
                                  type: "template",
                                  payload: {
                                      template_type: "generic",
                                      elements: [{
                                          title: "Ja! Hiciste clic, ahora tendrás que compartirme :D",
                                          buttons: [{
                                              type: "element_share"
                                          }],
                                      }]
                                  }
                              }
                          }
                      });
};

module.exports = event;
