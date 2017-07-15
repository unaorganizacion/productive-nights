const request = require('request');

function callSendAPI(messageData, cb = function(){}) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
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
      console.error("Unable to send message.", response);
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
    message: message
  };  

  callSendAPI(messageData);
};

module.exports = { sendTextMessage: sendTextMessage, sendObjectMessage:sendObjectMessage };