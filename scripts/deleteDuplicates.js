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

query.order('type', 'messageData');

let notDeleting = {};
let deleting = [];

query.run((err, entities, info) => {
    console.log('entities', entities.length);
  for (let entity of entities) {
    if (!search(entity.messageData, entity.day)) {
      notDeleting[entity[datastore.KEY].id] = entity;
    } else {
      datastore.delete(entity[datastore.KEY]).then(() => {
        console.log('deleted', entity[datastore.KEY].id);
        deleting.push(entity[datastore.KEY].id);
      });
    }
  }
  
  console.log(deleting);
});

function search(messageData, day) {
  for (let nd of Object.keys(notDeleting)) {
    let ndd = notDeleting[nd];
    
    if (
      JSON.stringify(ndd.messageData) === JSON.stringify(messageData) &&
      ndd.day === day
    ) {
      //console.log(JSON.stringify(ndd.messageData), 'equals', JSON.stringify(messageData));
      return true;
    }
  }
  
  return false;
}
