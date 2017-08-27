const _entities = require("./datastore-entities");
const datastore = _entities.datastore;
const sendMessage = require('./tools/sendMessage');
const waterfall = require("async/waterfall");

function fromDatastore (obj) {
    obj.id = obj[datastore.KEY].id;
    return obj;
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
            console.log('sending SHCEDULE message to user ',user.mId);
            sendMessage
                .sendTextMessage(
                    user.mId,
                    process.argv[2],
                    [
                        {
                            "content_type": "text",
                            "title": "VER",
                            "payload": `SCHEDULED_1_${process.argv[3]}`
                        },
                        {
                            "content_type": "text",
                            "title": "IGNORAR",
                            "payload": `SCHEDULED_0_${process.argv[3]}`
                        }
                    ],
                    function () {}
                );
        }
    }
});
