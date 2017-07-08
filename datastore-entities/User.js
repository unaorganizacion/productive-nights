let Promise = require("bluebird");
let rp = require('request-promise');

module.exports = function (datastore) {
  function fromDatastore (obj) {
    obj.id = obj[datastore.KEY].id;
    return obj;
  };
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
  
  return {
    getUserData: function (id, fields = ["first_name"]) {
      return new Promise(function (resolve, reject) {
        // first_name,last_name,profile_pic,locale,timezone,gender
        let fieldsStringify = fields.join(',');
        var options = {
          uri: `https://graph.facebook.com/v2.6/${id}?fields=${fieldsStringify}&access_token=${process.env.PAGE_ACCESS_TOKEN}`,
          /*headers: {
              'User-Agent': 'Request-Promise'
          },*/
          json: true // Automatically parses the JSON string in the response 
        };
        rp(options)
          .then(function (userData) {
            //console.log('user data response', userData);
            resolve(userData);
          }, function () {
            console.log("facebook data reject");
          })
          .catch(function (err) {
            console.log("facebook data error", err);
            reject();
          });
      });
    },
    create: function (id) {
      let self = this;
      return new Promise(function (resolve, reject){
        var key = datastore.key("User");

        self.getUserData(id, ["first_name", "last_name", "locale", "timezone"])
        .then(
          function (userData) {
            var data = {
              mId: id,
              userData: userData,
              interests: [],
              restriction: {
                level: 0,
              }
            };
            
            let entity = {
              key: key,
              data: toDatastore(data)
            };

            datastore.save(entity, function(err) {
              if (!err) {
                // Record saved successfully.
                data.id = entity.key.id;
                resolve(data);
              } else {
                console.error("datstore save error", err);
                reject();
              }
            });
          },
          function () {
            console.log("get user data rejected");
            reject();
          }
        );
      });
    },
    queryBy: function (field, value) {

    },
    getById: function (id) {
      return new Promise(function (resolve, reject) {
          let query = datastore.createQuery("User").filter('mId','=',id).limit(1);

          query.run(function(err, entities) {
            if (err) {
              // Error handling omitted.
              console.error("Error transation",err);
              return reject();
            } else if (entities.length < 1) {
              //console.error("entities length less than 1", entities);
              return reject();
            }
            // Transaction committed successfully.
            entities.map(fromDatastore);
            console.log("entities", entities[0]);
            resolve(entities[0]);
          });
      });
    },
    
    // todo: we could use here cache so we don't consume all out google datastore
    get: function (id) {
      let self = this;
      return new Promise(function (resolve, reject) {
        self.getById(id).then(
          function (entities) {
            resolve(entities);
          },
          function () {
            self.create(id).then(
              function (entity) {
                console.log("create user", entity);
                resolve(entity);
              },
              function () {
                console.log("create user rejected");
                reject();
              }
            );
          }
        );
      });
    }
  };
};