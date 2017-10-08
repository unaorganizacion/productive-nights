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
  /*   sendMessage.sendTextMessage(self.userObject.mId, "Ofertas y promociones entrantes están retenidas en lo que configuras tus opciones, selecciona HECHO cuando termines para recibir nuevamente los mensajes", [], resolve);
  })
  .then(function () {
    return new Promise(function (resolve) {   */
      sendMessage.sendTextMessage(
        self.userObject.mId,
        "¿Quieres AGREGAR o QUITAR intereses?",
                                   [ {
                                      "content_type": "text",
                                      "title": "Agregar",
                                      "payload": `CATEGORY_ADD`
                                    }, {
                                      "content_type": "text",
                                      "title": "Quitar",
                                      "payload": `CATEGORY_REMOVE`
                                    }], resolve);
    });
};

module.exports = event;