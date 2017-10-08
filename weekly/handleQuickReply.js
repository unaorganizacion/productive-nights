const
    weekly = require('./'),
    botMessages = require('../messages/bot-msgs'),
    sendMessage = require('../tools/sendMessage'),
    Promise = require("bluebird"),
    waterfall = require("async/waterfall")
;

module.exports = function (datastore, userObject, quick_reply) {
    let day = quick_reply.payload.split('_')[1].toLowerCase();

    function createQueryForWaterfall (posts) {
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
    
  
    weekly(datastore, userObject, day).then(postsElements => {
        // console.log(day, 'offers posts', postsElements);
        
        for (let posts of postsElements) {
            functions.push(createQueryForWaterfall(posts));
        }
      
        functions.reverse();
      
        waterfall(functions, (err, result) => {
            
        });
    }, (e) => {
        console.error(`No ${day} offers error`, e);
        sendMessage.sendTextMessage(userObject.mId, botMessages.WEEKLY_NO_POSTS, [], function(){},
                              [{
                                "type": "postback",
                                "title": botMessages.START_SENDING_OFFERS_BUTTON2,
                                "payload": "WEEKLY_PAYLOAD"
                              }]);
    });
};