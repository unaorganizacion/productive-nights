module.exports = [
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
];