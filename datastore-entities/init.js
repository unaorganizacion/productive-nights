/** Config of Datastore */
const Datastore = require('@google-cloud/datastore');
const projectId = 'copper-axiom-168220';
const datastore = Datastore({
  projectId: projectId,
  keyFilename: __dirname + '/key.json'
});

module.exports = datastore;