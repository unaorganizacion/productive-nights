/**
 * Created by andre on 28/06/17.
 */

let botMessages = require('../messages/bot-msgs');

const
    sendMessage = require('../tools/sendMessage'),
    PAUSED = 1,
    RESUME = 2
;

let event = function (userObject) {
    this.userObject = userObject;
};

event.prototype = {};

event.prototype.setDatastore = function (datastore) {
    this.datastore = datastore;
};

event.prototype.run = function () {
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

    let key = this.datastore.key(["User", parseInt(this.userObject.id, 10)]);

    let action = null;

    if (this.userObject.restriction < 2 || typeof this.userObject.restriction !== "number") {
        this.userObject.restriction = 2;
        action = PAUSED;
    } else {
        this.userObject.restriction = 0;
        action = RESUME;
    }

    const entity = {
        key: key,
        data: toDatastore(this.userObject)
    };


    this.datastore.save(entity, (err) => {
        if (err) {
            console.error("Error saving datastore category preference");
            return;
        }

        if (action === PAUSED)
            sendMessage.sendTextMessage(this.userObject.mId, "Se han pausado ofertas y promociones, presiona el botón debajo cuando estés listo para volver a recibirlas :D", [], function() {},
          [{
            "type": "postback",
            "title": "Reanudar",
            "payload": "RESUME_OFFERTS_PAYLOAD"
          }]);
        else {
            sendMessage.sendTextMessage(this.userObject.mId, botMessages.START_SENDING_OFFERS, [], function () {},
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
        }
    });
};

module.exports = event;
