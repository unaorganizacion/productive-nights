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
            today = moment().startOf('day'),
            tomorrow = moment().endOf('day'),
            posts = []
        ;

        function checkDup (postEntity) {
            let dup = false;
            for (let post of posts) {
                if (post.id === postEntity.id) dup = true;
            }
            return dup;
        }

        function createWaterfallFunction (category) {
            return function (cb) {
                console.log('querying for', category);
                let query = datastore.createQuery("Post")
                        .filter('categories', category)
                    //.filter('sentDate','>=', new Date(today))
                ;
                query.run((err, entities, info) => {
                    if (err) {
                        console.error("Error transation",err);
                        // probably no results
                        cb();
                        return;
                    }

                    //console.log('entity from cat', category, entities);
                    for (let entity of entities) {
                        let post = fromDatastore(entity);
                        let entitySentDate = moment(entity.sentDate);
                        console.log(entitySentDate.format('YYYY-MM-DD'));
                        if (!checkDup(post)) {
                            delete post.id;
                            posts.push(post);
                        } else {
                            console.log('dup or not in range', entitySentDate.isSame(today, 'd'), !checkDup(post));
                        }
                    }
                    cb();
                })
            }
        }

        let functions = [];
        for (let category of userObject.interest) {
            if (category !== "NaN" && !isNaN(category))
                functions.push(createWaterfallFunction(category));
        }

        waterfall(functions, (err, result) => {
            if (posts.length > 0) {
                let postsElements = [];
                if (posts.length > 10) {
                    let
                        page = 0,
                        elementsProcessed = 0
                    ;
                    postsElements.push([]);
                    for (let postToElement of posts) {
                        console.log(postToElement);
                        postsElements[page].push(postToElement);
                        elementsProcessed++;
                        if (elementsProcessed >= 10) {
                            page++;
                            elementsProcessed = 0;
                            postsElements.push([]);
                        }
                    }
                } else {
                    postsElements.push([]);
                    postsElements[0].push(posts);
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
