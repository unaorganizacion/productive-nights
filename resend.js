const entities = require("./datastore-entities");
const datastore = entities.datastore;
const sendMessage = require('./tools/sendMessage');
const waterfall = require("async/waterfall");

let entityId = parseInt(process.argv[2]), userId = process.argv[3];

let query = datastore.createQuery("Post")
    .filter('__key__', '=', datastore.key(['Post', entityId]))
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

    let postToElement = entities[0];

    delete postToElement.id;
    delete postToElement.sentDate;

    let users = [];

    if (typeof userId !== 'undefined') {
        users.push(parseInt(userId));
        sendMessage.sendObjectMessage(userId, {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [postToElement.messageData]
                }
            }
        });
    } else {
        let usersIds = [];

        function createQueryForWaterfall (category) {
            return function (cb) {
                let query = datastore.createQuery("User");
                query
                    .filter('interest', '=', category);

                query.run((error, entities) => {
                    if (error)
                        console.log('result for', typeof category, entities,'error',error);

                    for (let entity of entities) {
                        if (entity.restriction < 2) {
                            let user = fromDatastore(entity);
                            if (usersIds.indexOf(user.id) === -1) {
                                users.push(user);
                                usersIds.push(user.id);
                            }
                        }
                    }
                    cb();
                });
            }
        }

        let functions = [];
        for (let category of postToElement.categories) {
            functions.push(createQueryForWaterfall(category));
        }

        waterfall(functions, (err, result) => {
            if (err) {
                console.error('error waterfall');
            } else {
                for (let user of users) {
                    //postToElement.messageData.recipient = {id: user.mId};
                    console.log('sending message to user ',user.mId, postToElement);
                    sendMessage.sendObjectMessage(user.mId, {
                        attachment: {
                            type: "template",
                            payload: {
                                template_type: "generic",
                                elements: [postToElement.messageData]
                            }
                        }
                    });
                }
            }
        });
    }
});
