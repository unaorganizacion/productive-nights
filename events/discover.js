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
    var self = this;
    new Promise(function (resolve, reject) {
        sendMessage.sendTextMessage(
            self.userObject.mId, //1321637131264381,
            "Hola usuario, digo " + self.userObject.userData.first_name + " 😅 ¿Cómo estás? ¿Sobre qué te interesa ver promos?"
                  // process.argv[2],
            , [], resolve
        );
    }).then(function () {
        let posts =
            [ // key: 0 / MORNING M,T,W 
                  {
                    title: '1 ⏩',
                    buttons: [
                      {title: '🔥 Mis promos de hoy', payload: 'TODAY_PAYLOAD'},
                      {title: '📅 Todas las de hoy', payload: 'schedule_0,1,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,30,31'},
                      {title: '🍳 Desayunos', payload: 'schedule_16'}  
                    ]
                  },
                  {
                    title: '⏪ 2 ',
                    buttons: [
                      {title: '🛵 A domicilio', payload: 'schedule_25'},
                      {title: '🍴 Buffet', payload: 'schedule_31'},
                      //{title: '☕ Café y té', payload: 'schedule_0'},
                    ]
                  }
            ];
        let postsOfSets = [];
        for (let post of posts) {
            let buttons = [];
            for (let button of post.buttons) {
                buttons.push({
                    type: 'postback',
                    title: button.title,
                    payload: button.payload
                });
            }
            postsOfSets.push({
                title: post.title,
                buttons: buttons,
            });
        }
        sendMessage.sendObjectMessage(self.userObject.mId, {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: postsOfSets
                }
            }
        });
    });
};
module.exports = event;