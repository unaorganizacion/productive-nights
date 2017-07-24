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
    sendMessage.sendTextMessage(self.userObject.mId, "Allô !! Mon nom est Dillio et je suis Français. " +
      "Me crearon con el único propósito de que nunca vuelvas a perderte de una gran oferta o promoción", [], resolve);
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
          "De las siguientes categorías selecciona las que sean de tu interés y yo me encargo del resto." +
          " Cuando gustes podrás cambiar tus intereses en la opción CATEGORÍAS del menú",
          categoriesQuickResponse, resolve);
    });
  })
  .then(function () {
    console.log("Ended chain of messages");
  });
};

module.exports = event;
