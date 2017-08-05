let botMessages = require('../messages/bot-msgs');
const
    sendMessage = require('../tools/sendMessage'),
    DAYS = {
        monday: "MONDAY",
        tuesday: "TUESDAY",
        wednesday: "WEDNESDAY",
        thursday: "THURSDAY",
        friday: "FRIDAY",
        saturday: "SATURDAY",
        sunday: "SUNDAY",
    }
;

let event = function (userObject) {
    this.userObject = userObject;
};

event.prototype = {};

event.prototype.setDatastore = function (datastore) {
    this.datastore = datastore;
};

event.prototype.run = function () {
    let days = [];
    for(let day of Object.keys(DAYS)) {
        days.push({
            "content_type": "text",
            "title": botMessages.WEEKLY_DAYS[DAYS[day]],
            "payload": `WEEKLY_${DAYS[day]}`
        });
    }
    sendMessage
        .sendTextMessage(
            this.userObject.mId,
            botMessages.WEEKLY_START_MESSAGE,
            days,
            function () {}
        );
};

module.exports = event;
