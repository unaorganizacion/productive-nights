#!/usr/bin/env bash

#node node_modules/uglify-js/bin/uglifyjs menu.json.js -o menu.json.min.js -c -m
#sleep 1
JSON="$(cat ./menu.json)"

function send {
curl -X POST -H "Content-Type: application/json" -d "$JSON" "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=EAAD6OuqEjkEBAHW60DW6iZAMLicqAgBm4J7uMudwiZCY9xV0W68ZBKP5oKRixDdLonsPqugtZAZCQlvkFWalgbW8DK0j1RW5iimcdZCfrComm5TjbQyXY7doAttKru4WZBZCDCf2GbOPZBRODdwMZCBU2O2ZCHLwPT2dHo2ip1Y5w3gPAZDZD"
}

send; send; send;
printf "\n";