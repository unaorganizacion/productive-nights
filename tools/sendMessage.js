const request = require('request');

function callSendAPI(messageData, cb = function(){}) {
  request({
    uri: 'https://graph.facebook.com/v2.8/me/messages',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
      cb();
    } else {
      console.error("Unable to send message.");
      //console.error(response);
      //console.error(error);
      cb();
    }
  });  
}

let sendTextMessage = function (recipientId, messageText, quick_replies = [], cb = function(){}, buttons = []) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };
  
  if (quick_replies.length > 0) {
    messageData['message']['quick_replies'] = quick_replies;
    console.log("quick_replies length", quick_replies.length);
  }
  //console.log("buttonsl ength", buttons.length);
  if (buttons.length > 0) {
    delete messageData["message"]["text"];
    
    messageData["message"]["attachment"] = {};
    messageData["message"]["attachment"]["type"] = "template";
    messageData["message"]["attachment"]["payload"] = {};
    messageData["message"]["attachment"]["payload"]["template_type"] = "button";
    messageData["message"]["attachment"]["payload"]["text"] = messageText;
    messageData["message"]["attachment"]["payload"]["buttons"] = buttons;
    
    console.log("Buttons length", messageData["message"]["attachment"]["payload"]["buttons"].length);
  }

  callSendAPI(messageData, cb);
};

let sendObjectMessage = function(recipientId, message) {
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
};

module.exports = { sendTextMessage: sendTextMessage, sendObjectMessage:sendObjectMessage };