const
    scheduled = require('./'),
    botMessages = require('../messages/bot-msgs'),
    sendMessage = require('../tools/sendMessage')
;

module.exports = function (datastore, userObject, quick_reply) {
    let
        data = quick_reply.payload.split('_'),
        response = parseInt(data[1]),
        categoriesRaw = data[2].split(',')
    ;

    if (!response) {
        sendMessage
            .sendTextMessage(
                userObject.mId,
                "😠",
                [
                    {
                        "content_type": "text",
                        "title": botMessages.SCHEDULED_WELL_YES,
                        "payload": `SCHEDULED_1_${categoriesRaw}`
                    }
                ],
                function () {}
            );
    } else {
        let categories = [];
        for (let category of categoriesRaw) {
            categories.push(parseInt(category.trim()));
        }

        if (categories.length >= 1) {
            scheduled(datastore, userObject, categories).then(() => {
                console.log('scheduled event ended');
            });
        } else {
            console.log('No categories found');
        }
    }
};