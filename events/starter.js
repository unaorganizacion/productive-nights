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
    sendMessage.sendTextMessage(self.userObject.mId, "Allo " + self.userObject.userData.first_name + " 👋! Mon nom est Gabito y soy un pan francés 🇫🇷", [], resolve);
  }).then(function () {
    return new Promise(function (resolve) {
    sendMessage.sendTextMessage(self.userObject.mId, "¿Quieres salir en Chihuahua pero no sabes a dónde? ¡Yo te ayudo! Conozco las mejores ofertas y promociones de la ciudad", [], resolve);
    })
  })
  // todo: select random offer in the pool today-offers
  .then(function () {
    return new Promise(function (resolve) {
      let
        categories =
          require("../tools/compileCategories")
          (self.userObject.userData.interest, 1, self.userObject.userData.locale),
        categoriesQuickResponse = require("../tools/getCategoriesAsQuickReply")(self.userObject, 1, categories)
      ;
      // console.log("quick replies", categoriesQuickResponse);
      sendMessage.sendTextMessage(self.userObject.mId,
          "Para enterarte en caliente ⚡ de las mejores ofertas y promociones para ti, selecciona las categorías que sean de tu interés. Yo te avisaré cuando encuentre algo 😎" +
          "\u000ACuando gustes podrás cambiar tus intereses en el menú de abajo en la opción \"Otros > ☝️ Mis intereses\"",
          categoriesQuickResponse, resolve);
    });
  })
  .then(function () {
    console.log("Ended chain of messages");
  });
};

module.exports = event;
