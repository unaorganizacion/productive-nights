const
    scheduled = require('./'),
    botMessages = require('../messages/bot-msgs'),
    sendMessage = require('../tools/sendMessage'),
    waterfall = require("async/waterfall")
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
            scheduled(datastore, userObject, categories).then(postsElements => {
                console.log(categories, 'scheduled posts', postsElements);
                function createWaterfallFunctionPostsSets (posts) {
                    return function (cb) {
                        sendMessage.sendObjectMessage(userObject.mId, {
                            attachment: {
                                type: "template",
                                payload: {
                                    template_type: "generic",
                                    elements: posts
                                }
                            }
                        }, cb);
                    }
                }
                let functions = [];
                for (let posts of postsElements) {
                    functions.push(createWaterfallFunctionPostsSets(posts));
                }

                waterfall(functions, () => {
                    sendMessage.sendTextMessage(userObject.mId, '😚');
                });
            }, (e) => {
                console.error(`No ${categoriesRaw} posts error`, e);
                sendMessage.sendTextMessage(userObject.mId, botMessages.WEEKLY_NO_POSTS, [], function(){},
                    [{
                        "type": "postback",
                        "title": botMessages.START_SENDING_OFFERS_BUTTON2,
                        "payload": "WEEKLY_PAYLOAD"
                    }]);
            });
        } else {
            console.log('No categories found');
        }
    }
};