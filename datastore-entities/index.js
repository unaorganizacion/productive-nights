const datastore = require('./init');
const entities_arr = [
  ["user", "User"],
  []
];

let entities = {
  datastore: datastore
};

for (let entity of entities_arr) {
  if (entity.length > 0 && entity[0].length > 0) {
    entities[entity[0]] = {
      model: require("./"+entity[1])(datastore)
    };
  }
}

module.exports = entities;