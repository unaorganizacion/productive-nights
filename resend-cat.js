const entities = require("./datastore-entities");
const datastore = entities.datastore;
const sendMessage = require('./tools/sendMessage');
const waterfall = require("async/waterfall");

let entityId = parseInt(process.argv[2]);

let query = datastore.createQuery("Post")
    .filter('categories', '=', entityId)
;


function fromDatastore (obj) {
    obj.id = obj[datastore.KEY].id;
    return obj;
}

query.run((err, entities, info) => {
    if (err) {
        console.error("Error transation",err);
        // probably no results
        return;
    }

    let users = [];
    let usersIds = [];

    function createQueryForWaterfall () {
        return function (cb) {
            let query = datastore.createQuery("User");
            query
                .filter('restriction', '<', 2);

            query.run((error, entities) => {
                if (error)
                    console.log('result for', typeof category, entities,'error',error);

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
            for (let postToElement of entities) {
                delete postToElement.id;
                delete postToElement.sentDate;
              
                for (let user of users) {
                    console.log('sending message to user ',user.mId, postToElement);
                    /*sendMessage.sendObjectMessage(user.mId, {
                        attachment: {
                            type: "template",
                            payload: {
                                template_type: "generic",
                                elements: [postToElement.messageData]
                            }
                        }
                    });*/
                }
            }
        }
    });
});
