// starter.js
const Promise = require("bluebird");
const sendMessage = require('../tools/sendMessage');
let botMessages = require('../messages/bot-msgs');

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
    sendMessage.sendTextMessage(self.userObject.mId, "Allo " + self.userObject.userData.first_name + " 👋! Mon nom est Gabito y soy un pan francés 🇫🇷." +
                                "\u000A¿Quieres salir en Chihuahua y no sabes a dónde? ¡Yo te ayudo! Conozco las mejores ofertas y promociones de la ciudad 😎", [], resolve);
  }).then(function () {
    return new Promise(function (resolve) {
    sendMessage.sendTextMessage(self.userObject.mId, "\u000A🔸 Agrega tus intereses en AGREGAR INTERESES para hacerte saber cuando tenga algo para ti :D" +
                                "\u000A🔸 O presiona PROMOS POR DÍA para ver todas las promos por día."
                                ,[], function(){}, 
                            [
                              {
                                "type": "postback",
                                "title": "☝️ AGREGAR INTERESES",
                                "payload": "CATEGORIES_PAYLOAD"
                              },
                              {
                                "type": "postback",
                                "title": botMessages.START_SENDING_OFFERS_BUTTON2,
                                "payload": "WEEKLY_PAYLOAD"
                              }                              
    ], resolve);
    });
  })
  // todo: select random offer in the pool today-offers
  /*.then(function () {
    return new Promise(function (resolve) {
      let
        categories =
          require("../tools/compileCategories")
          (self.userObject.userData.interest, 1, self.userObject.userData.locale),
        categoriesQuickResponse = require("../tools/getCategoriesAsQuickReply")(self.userObject, 1, categories)
      ;
      // console.log("quick replies", categoriesQuickResponse);
      sendMessage.sendTextMessage(self.userObject.mId,
          "🔸Te recomiendo seguir 5 o más intereses antes de continuar para poder avisarte cuando tenga algo para ti." +
                                  "\u000A🔸Si lo prefieres puedes saltar este paso y ver las promos del día en la opción \"📅 Promos por día\" del menú debajo." +
          "\u000A🔸Cuando gustes puedes agregar más intereses en la opción \"Otros > ☝️ Mis intereses.\" " + 
                                  "\u000ABonne journée! 🌞",
          categoriesQuickResponse, resolve);
    });
  })*/
  .then(function () {
    console.log("Ended chain of messages");
  });
};

module.exports = event;
