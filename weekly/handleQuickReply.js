const
    weekly = require('./'),
    botMessages = require('../messages/bot-msgs'),
    sendMessage = require('../tools/sendMessage')
;

module.exports = function (datastore, userObject, quick_reply) {
    let day = quick_reply.payload.split('_')[1].toLowerCase();

    weekly(datastore, userObject, day).then(postsElements => {
        console.log(day, 'offers posts', postsElements);
        for (let posts of postsElements) {
            sendMessage.sendObjectMessage(userObject.mId, {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: posts
                    }
                }
            });
        }
    }, (e) => {
        console.error(`No ${day} offers error`, e);
        sendMessage.sendTextMessage(userObject.mId, botMessages.WEEKLY_NO_POSTS);
    });
};