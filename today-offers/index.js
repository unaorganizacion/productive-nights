const
    moment = require('moment'),
    waterfall = require("async/waterfall")
;

/**
 * Another option would be to get all the today offers and compare based on the user's categories
 * @param datastore
 * @param userObject
 * @returns {Promise}
 */
module.exports = function (datastore, userObject) {
    function fromDatastore (obj) {
        let newObj = obj.messageData;
        newObj.id = obj[datastore.KEY].id;
        return newObj;
    }

    return new Promise((resolve, reject) => {
        let
            posts = [],
            postsIds = []
        ;

        function checkDup (postEntity) {
            let dup = false;
            if (postsIds.indexOf(postEntity.id) !== -1) dup = true;
            return dup;
        }

        function createWaterfallFunction (category) {
            return function (cb) {
                let query = datastore.createQuery("Post")
                        .filter('categories', '=', category)
                ;
                query.run((err, entities, info) => {
                    if (err) {
                        console.error("Error transation",err);
                        // probably no results
                        cb();
                        return;
                    }

                    for (let entity of entities) {
                        let post = fromDatastore(entity);
                        post.sentDate = entity.sentDate;

                        if (!checkDup(post)) {
                            posts.push(post);
                            postsIds.push(post.id);
                        } else {
                            console.log('dup or not in range', !checkDup(post));
                        }
                    }
                    cb();
                });
            }
        }

        let functions = [];
        for (let category of userObject.interest) {
            if (category !== "NaN" && !isNaN(category))
                functions.push(createWaterfallFunction(category));
        }

        waterfall(functions, (err, result) => {
            if (posts.length > 0) {
                posts.sort(function(a, b) {
                  var nameA = new Date(a.sentDate); // ignore upper and lowercase
                  var nameB = new Date(b.sentDate); // ignore upper and lowercase
                  if (nameA < nameB) {
                    return 1;
                  }
                  if (nameA > nameB) {
                    return -1;
                  }
                  return 0;
                });
              console.log(posts);
              
                let postsElements = [];
                let
                    page = 0,
                    elementsProcessed = 0
                ;
                postsElements.push([]);
                for (let postToElement of posts) {
                    delete postToElement.id;
                    delete postToElement.sentDate;
                    postsElements[page].push(postToElement);
                    elementsProcessed++;
                    if (elementsProcessed >= 10) {
                        page++;
                        elementsProcessed = 0;
                        postsElements.push([]);
                    }
                }
                resolve(postsElements);
            } else {
                if (err) {
                    console.error(err);
                } else
                    console.error("today offers query did not throwed results", userObject.interest);
                reject();
            }
        });
    });
};

/*[
 {
 title: "Carlin's gay",
 subtitle: "Next-generation virtual reality",
 item_url: "https://www.oculus.com/en-us/rift/",
 image_url: "http://messengerdemo.parseapp.com/img/rift.png",
 buttons: [{
 type: "web_url",
 url: "https://goo.gl/maps/oguRzdieeyy",
 title: "Ver ubicación"
 }, {
 type: "postback",
 title: "Compartir anuncio",
 payload: "Payload for first bubble",
 }],
 }, {
 title: "touch",
 subtitle: "Your Hands, Now in VR",
 item_url: "https://www.oculus.com/en-us/touch/",
 image_url: "http://messengerdemo.parseapp.com/img/touch.png",
 buttons: [{
 type: "web_url",
 url: "https://www.facebook.com/sharer/sharer.php?u=https%3A//goo.gl/maps/oguRzdieeyy",
 title: "Share this con FB!"
 }, {
 type: "element_share",
 }]
 }
 ];*/
