const api = "https://discordapp.com/api/v8/";
const readline = require('readline');
const fetch = require('node-fetch');


console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan



  function ask(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}



async function connection(){
    const email = await ask("email:\n>");
    const password = await ask("password:\n>");

    
    
    var tokenBody = {
        "login":email,"password":password,"undelete":false,"captcha_key":null,"login_source":null,"gift_code_sku_id":null
    };
    var tokenHeaders = {
        'Origin': "https://discord.com",
        'Content-Type': 'application/json'
    };

    let TokenResponse = await fetch(api+"auth/login", {
        method: "POST",
        body: JSON.stringify(tokenBody),
        headers: tokenHeaders,
    })
    let TokenResponseJson = await TokenResponse.json()
    let token = TokenResponseJson.token
    if(token != null && token != undefined){
        console.log("Connecté !");
        return token;
    }else{
        console.log("Erreur ! reconecté vous svp !");
        return await connection();
    }
}

async function getUserGuild(token){

    var headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };
    // /users/@me/guilds

    let GuildReponse = await fetch(api+"users/@me/guilds", {
        method: "GET",
        headers: headers,
    });
    let GuildReponseJSON = await GuildReponse.json()    
    return GuildReponseJSON;
}

async function getGuildChannel(token, guildID){
    var headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };
    // /users/@me/guilds

    let GuildChannels = await fetch(api+"guilds/" + guildID +"/channels", {
        method: "GET",
        headers: headers,
    });
    let GuildChannelsJSON = await GuildChannels.json()    
    return GuildChannelsJSON;
}

async function sendGuildMessage(token){
    let guildList = await getUserGuild(token);

    for(let i=0; i<guildList.length; i++){
        console.log("Guild n°" + i + ": " + guildList[i].name);
    }

    let guildNumber = await ask("Guild: \n>");
    let guildID = guildList[guildNumber].id;

    let guildChannel = await getGuildChannel(token, guildID);

    for(let i=0; i<guildChannel.length; i++){
        console.log("Channel n°" + i + ": " + guildChannel[i].name);
    }

    let chanNumber = await ask("Guild: \n>");
    let chanID = guildChannel[chanNumber].id;

    let message = "";
    while(message.toLowerCase() != "console.stop"){
    message = await ask("message :\n>");
    if(message.toLowerCase() == "console.stop"){
        break;
    }
    var body = {
        "content": message,
        "tts": false
    };
    var headers = {
        'Authorization': token,
        'Content-Type': 'application/json'
    };
    fetch(api+"channels/"+chanID+"/messages", {
        method: "POST",
        body: JSON.stringify(body),
        headers: headers,
        }).then(res => res.json()).then(json => {
        //console.log(json);
    });
}
}
async function main(){

    let token = await connection();
    await sendGuildMessage(token)
}

main();