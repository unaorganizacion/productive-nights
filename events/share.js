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
  new Promise(function (resolve, reject) {
    sendMessage.sendTextMessage(self.userObject.mId, "¿Te gusta el trabajo que hago?, quizás deberías considerar compartirme con tus amigos para que ellos también disfruten de las mejores promos de la ciudad :)" + 
                                "\u000A🔸 Comparte el cuadro de abajo con ellos! 👇", [], resolve);
  }).then(function () {
    return new Promise(function (resolve) {
      sendMessage.sendAPI({
                          recipient: { id: self.userObject.mId },
                         message: {
                                attachment: {
                                    type: "template",
                                    payload: {
                                        template_type: "generic",                                          
                                          elements: [{
                                            item_url: 'https://m.me/dealnready',
                                            image_url: 'https://scontent-lax3-2.xx.fbcdn.net/v/t1.0-9/20728203_1339444069511904_8587439027125356164_n.png?oh=4133068136236f2e7534cb5df803a033&oe=5A2E4015',
                                            title: 'Pan Gabito',
                                          subtitle: 'De DEAL N\' READY',
                                            buttons: [{
                                                type: "element_share"
                                            }],
                                        }]
                                    }
                                }
                            }
                      });
    });
  });
  
};

module.exports = event;
