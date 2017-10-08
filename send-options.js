const _entities = require("./datastore-entities");
const datastore = _entities.datastore;
const sendMessage = require('./tools/sendMessage');
const waterfall = require("async/waterfall");
const Promise = require("bluebird");

let event = function (userObject) {
  this.userObject = userObject;
};

function fromDatastore (obj) {
    obj.id = obj[datastore.KEY].id;
    return obj;
}

let users = [];
let usersIds = [];

function createQueryForWaterfall () {
    return function (cb) {
        let query = datastore.createQuery("User");

        query.run((error, entities) => {
            if (error)
                console.log('result for', entities,'error',error);

            for (let entity of entities) {
                let user = fromDatastore(entity);
                if (usersIds.indexOf(user.id) === -1) {
                    users.push(user);
                    usersIds.push(user.id);
                }
            }
            cb();
        });
    }
}

let functions = [];
functions.push(createQueryForWaterfall());

waterfall(functions, (err, result) => {
    if (err) {
        console.error('error waterfall');
    } else {
        for (let user of users) {
          // line to test. what it do is that it will only process your id.
          // comment it to go live and send everyone
          //if (user.mId != 1321637131264381) continue;
            console.log('sending SCHEDULED message to user ',user.mId);
            new Promise(function (resolve, reject) {
              sendMessage.sendTextMessage(
                      user.mId, //1321637131264381,
                      "Allo " + user.userData.first_name + "! Hmm 🤔 me parece un buen día para desayunar fuera. Por suerte traigo nuevas promos en desayunos🍳 :D\u000A¡Tú eres genial! 😎" 
                  // process.argv[2],
                      ,[],resolve
                  );
            }).then(function () {
              let posts = [
                
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
                  },
                  /*{
                    title: '⏪ 3',
                    buttons: [
                      {title: '🍩 Postres', payload: 'schedule_10'},
                      
                    ]
                  }*/
                ],
                [ // key: 1 / AFTERNOON M,T,W 
                  {
                    title: '1 ⏩',
                    subtitle: '',
                    buttons: [
                      {title: '🔥 Mis promos de hoy', payload: 'TODAY_PAYLOAD'},
                      {title: '🌮 ¡A comer!', payload: 'schedule_1,3,4,5,6,7,8,9,12,14,17,18,19,21,26'},
                      {title: '🛵 A domicilio', payload: 'schedule_25'},
                    ]
                  },
                  {
                    title: '⏪ 2 ⏩',
                    buttons: [
                      {title: '👪 Paquetes familiares', payload: 'schedule_26'},
                      //{title: '🌭 Antojos y botanas', payload: 'schedule_1,3,4,5,6,7,8,9,12,14,17,18,19,21,26'},
                      {title: '🙂 Algo tranqui', payload: 'schedule_0,15,32'}, 
                      {title: '👸 Para ellas', payload: 'schedule_20'},                                           
                    ]
                  },
                  {
                    title: '⏪ 3 ',
                    buttons: [
                      {title: '♥️ Parejas', payload: 'schedule_27'},
                      {title: '🍽️ Cena formal', payload: 'schedule_27'},                  
                      //{title: '🎉 Cumpleaños', payload: 'schedule_24'},
                    ]
                  }/*,
                  {
                    title: '⏪ 4',
                    buttons: [
                      {title: '☕ Café y té', payload: 'schedule_0'},                      
                      {title: '🍦 Postres', payload: 'schedule_10'},
                    ]
                  }*/
                ],
                [ // key: 2 / SPECIAL OPTIONS 
                  {
                    title: '1 ⏩',
                    buttons: [
                      {title: '🇲🇽🎊 ¡VIVA MÉXICO CABRONES!🇲🇽', payload: 'schedule_29'},
                      {title: '🔥 Mis promos de hoy', payload: 'TODAY_PAYLOAD'},
                      //{title: '🍳 Desayunos', payload: 'schedule_16'}                      
                    ]
                  },
                  {
                    title: '⏪ 2',
                    buttons: [
                      {title: '🎉 Cumpleaños', payload: 'schedule_24'},
                      {title: '👪 Paquetes familiares', payload: 'schedule_26'},
                      {title: '🛵 A domicilio', payload: 'schedule_25'}                
                    ]
                  },
                  /*{
                    title: '⏪ 3',
                    buttons: [
                      {title: '☕ Café y té', payload: 'schedule_0'},
                      {title: '🍩 Postres', payload: 'schedule_10'},
                      
                    ]
                  }*/
                ]
              ];
              let postsOfSets = [];
              for (let post of posts[process.argv[2]]) {
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
              };
              sendMessage.sendObjectMessage(user.mId, {
                  attachment: {
                      type: "template",
                      payload: {
                          template_type: "generic",
                          elements: postsOfSets
                      }
                  }
              });
          });
          //break;
        }
    }
});
