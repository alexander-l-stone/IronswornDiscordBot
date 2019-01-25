const Discord = require('discord.js');
var auth = require('./auth.json');
const client = new Discord.Client();

client.on('ready', () => {
  // List servers the bot is connected to
  console.log("Servers:")
  client.guilds.forEach((guild) => {
      console.log(" - " + guild.name);

      // List all channels
      guild.channels.forEach((channel) => {
          console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
      });
  });
});
bot_secret_token = auth.token;

client.on('message', (receivedMessage) => {
  if (receivedMessage.author == client.user)
  {
    return;
  }
  
  if (receivedMessage.content.startsWith("!"))
  {
    parseCommand(receivedMessage);
  }
  else if (receivedMessage.content == "?")
  {
    parseHelp(receivedMessage);
  }
});

function rollDice(modifier=0){
  //rolls 1d6+modifier and checks to see how many d10s its greater than.
  let six = Math.floor(Math.random() * (6 - 1 + 1)) + 1 + modifier;
  let d1 = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  let d2 = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  if((d1 > six) && (d2 > six) && (d1 !== d2))
  {
    return "Miss";
  }
  else if ((d1 >= six) && (d2 >= six) && (d1 === d2))
  {
    return "Miss Critical";
  }
  else if ((d1 < six) && (d2 < six) && (d1 !== d2))
  {
    return "Strong-Hit";
  }
  else if((d1 < six) && (d2 < six) && (d1 === d2))
  {
    return "Strong-Hit Critical";
  }
  else if((d1 < six) || (d2 < six) && (d1 !== d2))
  {
    return "Weak-Hit";
  }
  else if ((d1 < six) || (d2 < six) && (d1 === d2)) {
    return "Weak-Hit Critical";
  }
  else 
  {
    return "Error"
  }
}

function parseCommand(receivedMessage){
  return;
}

function parseHelp(receivedMessage){
  let fullMessage = receivedMessage.content.substr(1);
  if (fullMessage === "")
  {
    helpCommand("", receivedMessage);
  }
  return;
}

function helpCommand(args, receivedMessage) {
  if (args === "") {
    receivedMessage.channel.send("This is a bot for playing the tabletop RPG Ironsworn on your server. Type ? and then a command to learn more. The commands are: ")
  }
}

client.login(bot_secret_token);