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
    sendMessage.sendTextMessage(self.userObject.mId, " Allô " + self.userObject.userData.first_name + " 👋!! Mon nom est Dillio et je suis Français 🇫🇷", [], resolve);
  }).then(function () {
    return new Promise(function (resolve) {
    sendMessage.sendTextMessage(self.userObject.mId, "Mi objetivo es que nunca vuelvas a perderte de una gran oferta o promoción en tu ciudad", [], resolve);
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
          "Tú solo selecciona las categorías que sean de tú interés, el resto déjalo en mis manos 😎." +
          " Cuando gustes podrás cambiar tus intereses en la opción CATEGORÍAS del menú",
          categoriesQuickResponse, resolve);
    });
  })
  .then(function () {
    console.log("Ended chain of messages");
  });
};

module.exports = event;
