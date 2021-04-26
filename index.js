const api = "https://discordapp.com/api/v8/users/@me/settings";
const config = require("./config.json");
const request = require("request");

const statusAnimation = statusAnimationSpin 
const activity = "";

let textAnimation = ""
var size = Object.keys(statusAnimation.animation).length;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var options = {
    url: api,
    method: "PATCH",
    json: {
        custom_status: {
            text: textAnimation,
            emoji_id: null,
            emoji_name: null
        }
    },
    headers: {
        'Authorization': config.token
    }
  };


async function loop(){
for(let i=0; i<size;i++){
    let timeout = statusAnimation.animation[i].timeout;
    textAnimation = activity + "" +  statusAnimation.animation[i].text;
    options.json.custom_status.text = textAnimation;
    console.log("Text i:" + i +  " " + statusAnimation.animation[i].text);
    //console.log(statusAnimation.animation[i].timeout);
    await changeActivity();
    await new Promise(resolve => setTimeout(resolve, timeout));
    }
    loop();
}

console.log("Let's funcking go...")
loop();



async function changeActivity(){
    request(options, function (error, response, body) {
        //console.error('error:', error); // Print the error if one occurred
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //console.log('body.custom_status:', body); // Print the HTML for the Google homepage.
      });
};
changeActivity();