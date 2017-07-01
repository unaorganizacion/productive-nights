/**
 * Created by andre on 1/07/17.
 */
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

    let action = null;

    if (this.userObject.restriction < 2 || typeof this.userObject.restriction !== "number") {
        sendMessage.sendTextMessage(this.userObject.mId, "¡Genial! En cualquier momento comenzarás a recibir mensajes con ofertas y promociones para ti", [], function () {},
            [{
                "type": "postback",
                "title": "Ver ofertas de hoy",
                "payload": "TODAY_PAYLOAD"
            }]);
        return;

    } else {
        this.userObject.restriction = 0;
        action = RESUME;
    }

    let key = this.datastore.key(["User", parseInt(this.userObject.id, 10)]);

    const entity = {
        key: key,
        data: toDatastore(this.userObject)
    };


    this.datastore.save(entity, (err) => {
        if (err) {
            console.error("Error saving datastore category preference");
            return;
        }

        sendMessage.sendTextMessage(this.userObject.mId, "¡Genial! En cualquier momento comenzarás a recibir mensajes con ofertas y promociones para ti", [], function () {},
            [{
                "type": "postback",
                "title": "Ver ofertas de hoy",
                "payload": "TODAY_PAYLOAD"
            }]);
    });
};

module.exports = event;
