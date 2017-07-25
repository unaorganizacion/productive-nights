let botMessages = require('../messages/bot-msgs');
const sendMessage = require('../tools/sendMessage');
const utilities = require('../tools/utilities');

const MODE_ADD = 1;
const MODE_REMOVE = 2;

module.exports = function (datastore, userObject, quick_reply) {
  function toDatastore (obj, nonIndexed) {
    nonIndexed = nonIndexed || [];
    const results = [];
    Object.keys(obj).forEach((k) => {
      if (obj[k] === undefined) {
        return;
      }
      results.push({
        name: k,
        value: obj[k],
        excludeFromIndexes: nonIndexed.indexOf(k) !== -1
      });
    });
    return results;
  }

  /*if (userObject.restriction.level === 0) {
    userObject.restriction.level = 1;
  }*/

  let
    categorySP = quick_reply.payload.split('_'),
    categories = [],
    category = {},
    mode = MODE_ADD,
    notCategory = false,
    offset = 0
  ;
  category.name = categorySP[0].toLowerCase();

  if (categorySP[1].toLowerCase() === "next") {
    mode = parseInt(categorySP[3]);
    offset = parseInt(categorySP[2]);
    categories = require("../tools/compileCategories")(userObject.userData.interest, mode, userObject.userData.locale, offset);
    notCategory = true;
    console.log("Next button", categories, mode);
  }

  console.log(categorySP, categorySP[1], categorySP[1].toLowerCase());
  if (categorySP[1].toLowerCase() === "end") {
    console.log("sending last category message");    
    sendMessage.sendTextMessage(userObject.mId, botMessages.START_SENDING_OFFERS, [], function(){},
                               [{
                                 "type": "postback",
                                  "title": botMessages.START_SENDING_OFFERS_BUTTON1,
                                  "payload": "TODAY_PAYLOAD"
                               },
                              {
                                "type": "postback",
                                "title": botMessages.START_SENDING_OFFERS_BUTTON2,
                                "payload": "SHARE_PAYLOAD"
                              }]);
    return;
  }

  category.id = parseInt(categorySP[1]);

  if (categorySP[1].toLowerCase() === "remove") {
    try {
    mode = MODE_REMOVE;
    categories = require("../tools/compileCategories")(userObject.userData.interest, mode, userObject.userData.locale, offset);
    let categoriesQuickResponse = require("../tools/getCategoriesAsQuickReply")(userObject, MODE_REMOVE, categories, offset);
    console.log("Remove categories button", categoriesQuickResponse);
    sendMessage.sendTextMessage(userObject.mId, "Estás son las categorías que sigues actualmente, selecciona las que quieras dejar de seguir", categoriesQuickResponse);
    } catch (e) { console.log('Hubo un error', e) }
    return;
  }

  if (categorySP.length > 2 && parseInt(categorySP[2]) === MODE_REMOVE) {
    mode = MODE_REMOVE;
    categories = []; // we need some extra data in order to get categories
  }

  if (typeof userObject.interest === "undefined") {
    userObject.interest = [];
  }

  if (!notCategory && mode === MODE_ADD && userObject.interest.indexOf(category.id) >= 0) return;
  if (!notCategory && mode === MODE_REMOVE && userObject.interest.indexOf(category.id) === -1) return;

  if (!notCategory && mode === MODE_ADD)
    userObject.interest.push(category.id);
  else if (!notCategory && mode === MODE_REMOVE) {
    let index = userObject.interest.indexOf(category.id);
    if (index > -1) {
      userObject.interest.splice(index, 1);
    }
  }

  // Error showing categories not in interest and saving NaNs in interest. Maybe a clean function

  console.log('Prev step', userObject);

  let key = datastore.key(["User", parseInt(userObject.id, 10)]);

  userObject.interest = utilities.cleanUserInterests(userObject.interest);
  console.log("clean user interests not error", categories);

  const entity = {
    key: key,
    data: toDatastore(userObject)
  };

  datastore.save(
    entity,
    (err) => {
      if (err) {
        console.error("Error saving datastore category preference");
        return;
      }
      userObject.id = entity.key.id;
      let categoriesQuickResponse = require("../tools/getCategoriesAsQuickReply")(userObject, mode, categories, offset);
      //console.log("quick replies", categoriesQuickResponse);
      if (mode === MODE_ADD)
        sendMessage.sendTextMessage(userObject.mId, "Puedes seguir más categorías o seleccionar HECHO para continuar",
                                    categoriesQuickResponse);
      else if (mode === MODE_REMOVE)
        sendMessage.sendTextMessage(userObject.mId, "Listo, ¿alguna otra categoría que quieras quitar de tus intereses?, También puedes seleccionar HECHO si deseas terminar",
                                    categoriesQuickResponse);
    }
  );
};
