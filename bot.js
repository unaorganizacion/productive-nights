//
// This is main file containing code implementing the Express server and functionality for the Express echo bot.
// test
'use strict';
const Promise = require("bluebird");
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
let messengerButton = "<html><head><title>Facebook Messenger Bot</title></head><body><h1>Facebook Messenger Bot</h1>This is a bot based on Messenger Platform QuickStart. For more details, see their <a href=\"https://developers.facebook.com/docs/messenger-platform/guides/quick-start\">docs</a>.<script src=\"https://button.glitch.me/button.js\" data-style=\"glitch\"></script><div class=\"glitchButton\" style=\"position:fixed;top:20px;right:20px;\"></div></body></html>";// Imports the Google Cloud client library

const entities = require("./datastore-entities");
// todo: fix this you lazy bastard!
const events = require("./events")(entities.datastore);
const categories = require('./categories');
const psswrd = '6CEF5D2255D269D01C6A211730A8B45885ED144325AA0198161BBFDD96D8086E';


// The rest of the code implements the routes for our Express server.
let app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Boteru-Password-Oytupw94nih");
    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.sendStatus(200);
    }
    else {
        //move on
        next();
    }
});

app.options("/*", function (req, res, next) {
    if (req.header('X-Boteru-Password-Oytupw94nih') === psswrd) {
        res.header('Access-Control-Allow-Origin', '*');
    } else {
        res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, X-Boteru-Password-Oytupw94nih');
    res.send(200);
});

app.use('/images', express.static('images'));

// Webhook validation
app.get('/webhook', function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

// Display the web page
app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(messengerButton);
    res.end();
});

app.get('/categories', function (req, res) {
    // todo: put restriction through header-key
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.write(JSON.stringify(categories));
    res.end();
});

app.post('/postMessage', (req, res) => {
    let password = req.header('X-Boteru-Password-Oytupw94nih');

    if (password === psswrd) {
        res.writeHead(200, {
            'Content-Type': 'application/json',
        });

        if (typeof req.body.env !== 'undefined' && req.body.env.length !== null && req.body.env.length > 0) {
            switch (req.body.env) {
                case 'test':
                    if (req.body.text) {
                        sendTextMessage(1286379258123767, req.body.text);
                    } else if (req.body.file) {
                        const fs = require('fs');
                        const regex = /^data:.+\/(.+);base64,(.*)$/;

                        let matches = req.body.file.match(regex);
                        let ext = matches[1];
                        let data = matches[2];
                        let buffer = new Buffer(data, 'base64');
                        const fileName = 'file.' + ext;
                        fs.writeFileSync('images/' + fileName, buffer);
                        let deleteImage = function () {
                            // fs.unlinkSync(fileName);
                        };
                        uploadFile('https://productive-night.glitch.me/images/' + fileName).then(id => {
                            console.log('fb response', id);
                            let messageData = {
                                recipient: {
                                    id: 1286379258123767
                                },
                                "message": {
                                    "attachment": {
                                        "type": "file",
                                        "payload": id,
                                    }
                                }
                            };

                            callSendAPI(messageData);
                            deleteImage();
                        }, deleteImage);
                    }
                    break;
                case 'production':
                    // propagateMessage(req.body);
                    break;
            }
        }

        res.write(JSON.stringify({
            'status': 'OK'
        }));
    } else {
        res.writeHead(404, {
            'Access-Control-Allow-Origin': 'http://localhost:8101',
            'Content-Type': 'application/json'
        });
    }
    res.end();
});

// Message processing
app.post('/webhook', function (req, res) {
    console.log(req.body);
    // tood: get user or register user
    var data = req.body;

    // Make sure this is a page subscription
    if (data.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function (entry) {
            var pageID = entry.id;
            var timeOfEvent = entry.time;
            if (!entry.messaging) return;
            // Iterate over each messaging event
            entry.messaging.forEach(function (event) {
                entities.user.model.get(event.sender.id).then(
                    function (userObject) {
                        /**
                         * userObject.mId
                         * userObject.userData -> .first_name .last_name .locale .timezone
                         *
                         *  Example: userObject.userData.first_name
                         */
                        if (event.message) {
                            receivedMessage(event, userObject);
                        } else if (event.postback) {
                            receivedPostback(event, userObject);
                        } else {
                            console.log("Webhook received unknown event: ", event);
                        }
                    },
                    function () {
                        console.error("user model get gave error");
                    });
            });
        });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know
        // you've successfully received the callback. Otherwise, the request
        // will time out and we will keep trying to resend.
        res.sendStatus(200);
    }
});

// Incoming events handling
function receivedMessage(event, userObject) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    var messageId = message.mid;

    var messageText = message.text;
    var messageAttachments = message.attachments;
    let isQuickReply = typeof message.quick_reply !== "undefined";

    if (isQuickReply) {
        let
            type = message.quick_reply.payload.toLowerCase().split("_")[0],
            folderType
        ;

        switch (type) {
            case 'category':
                folderType = 'categories';
        }

        if (folderType.length > 0) {
            require(`./${folderType}/handleQuickReply`)(entities.datastore, userObject, message.quick_reply);
        }

        return;
    }

    if (messageText) {
        // If we receive a text message, check to see if it matches a keyword
        // and send back the template example. Otherwise, just echo the text we received.
        switch (messageText) {
            case 'generic':
                sendGenericMessage(senderID);
                break;

            default:
                sendTextMessage(senderID, messageText.split('').reverse().join(''));
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }
}

function receivedPostback(event, userObject) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    // The 'payload' param is a developer-defined field which is set in a postback
    // button for Structured Messages.
    var payload = event.postback.payload;

    console.log("Received postback for user %d and page %d with payload '%s' " +
        "at %d", senderID, recipientID, payload, timeOfPostback);

    // When a postback is called, we'll send a message back to the sender to
    // let them know it was successful
    // sendTextMessage(senderID, "Postback called");

    try {
        events.get(userObject, payload).run();
    } catch (e) {
        console.error("Error retrieving event object.", e);
        sendTextMessage(senderID, "DDDDDDDD:\u000ADisculpáme, algo anda mal pero no te preocupes, ¡pronto lo solucionaremos! :D");
    }
}

//////////////////////////
// Sending helpers
//////////////////////////
function sendTextMessage(recipientId, messageText) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };

    callSendAPI(messageData);
}

function sendGenericMessage(recipientId) {
    var messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [{
                        title: "rift",
                        subtitle: "Next-generation virtual reality",
                        item_url: "https://www.oculus.com/en-us/rift/",
                        image_url: "http://messengerdemo.parseapp.com/img/rift.png",
                        buttons: [{
                            type: "web_url",
                            url: "https://www.oculus.com/en-us/rift/",
                            title: "Open Web URL"
                        }, {
                            type: "postback",
                            title: "Call Postback",
                            payload: "Payload for first bubble",
                        }],
                    }, {
                        title: "touch",
                        subtitle: "Your Hands, Now in VR",
                        item_url: "https://www.oculus.com/en-us/touch/",
                        image_url: "http://messengerdemo.parseapp.com/img/touch.png",
                        buttons: [{
                            type: "web_url",
                            url: "https://www.oculus.com/en-us/touch/",
                            title: "Open Web URL"
                        }, {
                            type: "postback",
                            title: "Call Postback",
                            payload: "Payload for second bubble",
                        }]
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

function uploadFile(url) {
    return new Promise((resolve, reject) => {
        request({
            uri: 'https://graph.facebook.com/v2.6/me/message_attachments',
            qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
            method: 'POST',
            json: {
                "message": {
                    "attachment": {
                        "type": "image",
                        "payload": {
                            "url": url,
                            "is_reusable": true,
                        }
                    }
                }
            }
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(body);
            } else {
                console.error("Unable to upload file.");
                console.error(response);
                console.error(error);
                reject(error);
            }
        });
    });
}

function callSendAPI(messageData, form = false, filedata = null) {
    let cb = function (error, response, body) {
        if (!error && response.statusCode === 200) {
            let recipientId = body.recipient_id;
            let messageId = body.message_id;

            console.log("Successfully sent generic message with id %s to recipient %s",
                messageId, recipientId);
        } else {
            console.error("Unable to send message.");
            console.error(response);
            console.error(error);
        }
    };

    if (!form) {
        request({
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
            method: 'POST',
            json: messageData
        }, cb);
    } else {
        if (filedata) {
            messageData.filedata = filedata;
        }
        request.post({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
            form: messageData
        }, cb);
    }


}

// Set Express to listen out for HTTP requests
var server = app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port %s", server.address().port);
});
