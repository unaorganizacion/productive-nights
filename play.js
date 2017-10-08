/**
 * Created by andre on 9/07/17.
 */
process.env.PAGE_ACCESS_TOKEN = "EAAD6OuqEjkEBAHW60DW6iZAMLicqAgBm4J7uMudwiZCY9xV0W68ZBKP5oKRixDdLonsPqugtZAZCQlvkFWalgbW8DK0j1RW5iimcdZCfrComm5TjbQyXY7doAttKru4WZBZCDCf2GbOPZBRODdwMZCBU2O2ZCHLwPT2dHo2ip1Y5w3gPAZDZD";
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
        .filter('__key__', '=', datastore.key(['Post', 5644309118320640]))
        // .filter('interest', '=', 1)
    //.filter('sentDate','>=', today)
;
query.run((err, entities, info) => {
    console.log(entities)
});