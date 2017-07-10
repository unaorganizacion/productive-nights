const moment = require('moment');

module.exports = function (datastore, userObject) {
    function fromDatastore (obj) {
        let newObj = obj.messageData;
        newObj.id = obj[datastore.KEY].id;
        return newObj;
    }

    return new Promise((resolve, reject) => {
        let today = moment().format('YYYY-MM-DD');
        let query = datastore.createQuery("Post")
            .filter('sentDate','>=', new Date(today))
        ;

        for (let category of userObject.interest) {
            query.filter('category', '=', category);
        }

        query.run(function(err, entities) {
            if (err) {
                // Error handling omitted.
                console.error("Error transation",err);
                return reject();
            } else if (entities.length < 1) {
                console.error("today offers query did not throwed results", entities);
                return reject();
            }
            // Transaction committed successfully.
            entities.map(fromDatastore);

            resolve(entities);
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
