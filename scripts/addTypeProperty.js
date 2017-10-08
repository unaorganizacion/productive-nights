/**
 * Created by andre on 9/07/17.
 */
process.env.PAGE_ACCESS_TOKEN = "EAAD6OuqEjkEBAHW60DW6iZAMLicqAgBm4J7uMudwiZCY9xV0W68ZBKP5oKRixDdLonsPqugtZAZCQlvkFWalgbW8DK0j1RW5iimcdZCfrComm5TjbQyXY7doAttKru4WZBZCDCf2GbOPZBRODdwMZCBU2O2ZCHLwPT2dHo2ip1Y5w3gPAZDZD";

const
    moment = require('moment'),
    waterfall = require("async/waterfall"),
    entities = require("../datastore-entities"),
    datastore = entities.datastore
;

let
    today = moment().utc().startOf('day').toDate(),
    posts = []
;

function toDatastore (obj, nonIndexed) {
    nonIndexed = nonIndexed || [];
    const results = [];
    Object.keys(obj).forEach((k) => {
      if (obj[k] === undefined) {
        return;
      }
      results.push({
        name: k,
        value: obj[k],
        excludeFromIndexes: nonIndexed.indexOf(k) !== -1
      });
    });
    return results;
  };

let query = datastore.createQuery("Post");

query.filter('type', '>=', 'promo');
query.filter('type', '<=', 'promo');

query.run((err, entities, info) => {
    for (let entity of entities) {
      entity.type = 'promo';
      let _entity = {
        key: datastore.key(['Post', entity.id]),
        data: toDatastore(entity)
      };

      datastore.save(_entity, function(err) {
        if (err) {
          console.error("datstore save error", err);
        }
      });
    }
});