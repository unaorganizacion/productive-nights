/**
 * Created by andre on 9/07/17.
 */
const
    moment = require('moment'),
    waterfall = require("async/waterfall")
;
const entities = require("./datastore-entities");
const datastore = entities.datastore;

let
    today = moment().utc().startOf('day').toDate(),
    posts = []
;

let query = datastore.createQuery("Post")
    .filter('categories', '=', 0)
    //.filter('sentDate','>=', today)
;
query.run((err, entities, info) => {
    console.log(err, entities, info)
});