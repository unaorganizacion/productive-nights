// starter.js
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
  let self = this;
  
  new Promise(function (resolve, reject) {
    sendMessage.sendTextMessage(self.userObject.mId, "¿Quieres quitar o agregar alguna categoría de tus intereses? ¡Yo te ayudo!", [], resolve);
  })
  .then(function () {
    return new Promise(function (resolve) {
      sendMessage.sendTextMessage(
        self.userObject.mId, 
        "Ofertas y promociones entrantes están retenidas en lo que configuras tus opciones, recuerda seleccionar HECHO cuando termines para recibir nuevamente los mensajes.", 
                                   [ {
                                      "content_type": "text",
                                      "title": "Agregar",
                                      "payload": `CATEGORY_ADD`
                                    }, {
                                      "content_type": "text",
                                      "title": "Quitar",
                                      "payload": `CATEGORY_REMOVE`
                                    },{
                                      "content_type": "text",
                                      "title": "Salir",
                                      "payload": `CATEGORY_END`
                                    }], resolve);
    });
  });
  
};

module.exports = event;
