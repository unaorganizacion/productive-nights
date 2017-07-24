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
    sendMessage.sendTextMessage(self.userObject.mId, "¡Heyyyyyy! Mi nombre es Dillio y mi propósito es que nunca vuelvas a perderte de una gran oferta o promoción", [], resolve);
  })
  .then(function () {
    return new Promise(function (resolve) {
      sendMessage.sendTextMessage(self.userObject.mId, "Por ahora solo conozco las de Chihuahua, Chihuahua. ¡Pero pronto agregaré más ciudades :D!", [], resolve);
    });
  })
  // todo: select random offer in the pool today-offers
  .then(function () {
    return new Promise(function (resolve) {
      let
        categories = require("../tools/compileCategories")(self.userObject.userData.interest, 1, self.userObject.userData.locale),
        categoriesQuickResponse = require("../tools/getCategoriesAsQuickReply")(self.userObject, 1, categories)
      ;
      sendMessage.sendTextMessage(self.userObject.mId, "¿Quieres enterarte de lo mejor y solo lo mejor? ¡Yo sé que sí! De las siguientes categorías selecciona las que sean de tu interés", categoriesQuickResponse, resolve);
    });
  })
  .then(function () {
    console.log("Ended chain of messages");
  });
};

module.exports = event;
