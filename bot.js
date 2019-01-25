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