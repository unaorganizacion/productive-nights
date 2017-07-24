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
  //console.log("sending today event to", this.userObject.mId, this.datastore);
  let self = this;
  new Promise(function (resolve, reject) {
    sendMessage.sendTextMessage(self.userObject.mId, "Allô !! Mon nom est Dillio et je suis Français. Me crearon con el único propósito de que nunca vuelvas a perderte de una gran oferta o promoción", [], resolve);
  })
  /* .then(function () {
    return new Promise(function (resolve) {
      sendMessage.sendTextMessage(self.userObject.mId, "Por ahora solo conozco las de Chihuahua, Chihuahua. ¡Pero pronto agregaré más ciudades :D!", [], resolve);
    });
  })
  .then(function () {
    return new Promise(function (resolve) {
      sendMessage.sendTextMessage(self.userObject.mId, "Solo por haberme agregado te voy a regalar...", [], resolve);
    });
  }) */
  // todo: select random offer in the pool today-offers
  .then(function () {
    return new Promise(function (resolve) {
      let categoriesQuickResponse = require("../tools/getCategoriesAsQuickReply")(self.userObject);
      // console.log("quick replies", categoriesQuickResponse);
      sendMessage.sendTextMessage(self.userObject.mId, "De las siguientes categorías selecciona las que sean de tu interés y yo me encargo del resto. Cuando gustes podrás cambiar tus intereses en la opción CATEGORÍAS del menú", categoriesQuickResponse, resolve);
    });
  })
  .then(function () {
    console.log("Ended chain of messages");
  });
};

module.exports = event;
