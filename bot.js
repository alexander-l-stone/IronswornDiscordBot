const Discord = require('discord.js');
var auth = require('./auth.json');
var fs = require('fs');
const client = new Discord.Client();
const logfile = "console.log";

client.on('ready', () => {
  // List servers the bot is connected to
  console.log("Servers:");
  fs.appendFile(logfile, 'Server: \n', function(err) 
  {
    if (err) throw err;
    console.log("Error writing file!");
  });
  client.guilds.forEach((guild) => {
      console.log(" - " + guild.name);
      fs.appendFile(logfile," - " + guild.name + "\n", function (err) {
        if (err) throw err;
        console.log("Error writing file!");
      });
      // List all channels
      guild.channels.forEach((channel) => {
          console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
          fs.appendFile(logfile, ` -- ${channel.name} (${channel.type}) - ${channel.id}\n`, function (err) {
            if (err) throw err;
            console.log("Error writing file!");
          });
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
  let d6 = Math.floor(Math.random() * (6 - 1 + 1)) + 1 + modifier;
  let d1 = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  let d2 = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  console.log("D6:" + d6);
  console.log("D10 1:" + d1);
  console.log("D10 2:" + d2);
  if((d1 >= d6) && (d2 >= d6) && (d1 !== d2))
  {
    return "Miss";
  }
  else if ((d1 >= d6) && (d2 >= d6) && (d1 === d2))
  {
    return "Miss Critical";
  }
  else if ((d1 < d6) && (d2 < d6) && (d1 !== d2))
  {
    return "Strong-Hit";
  }
  else if((d1 < d6) && (d2 < d6) && (d1 === d2))
  {
    return "Strong-Hit Critical";
  }
  else if((d1 < d6) || (d2 < d6) && (d1 !== d2))
  {
    return "Weak-Hit";
  }
  else if ((d1 < d6) || (d2 < d6) && (d1 === d2)) {
    return "Weak-Hit Critical";
  }
  else 
  {
    return "Error";
  }
}

function parseCommand(receivedMessage){
  let fullMessage = receivedMessage.content.substr(1);
  let splitMessage = fullMessage.split(" ");
  let command = splitMessage[0];
  let arguments = splitMessage.slice(1);

  console.log(`Command recieved: ${command}\nArguments: ${arguments}`);
  fs.appendFile(logfile, `Command recieved: ${command}\nArguments: ${arguments}\n`, function (err) {
    if (err) throw err;
    console.log("Error writing file!");
  });

  if(command == 'dice')
  {
    if(arguments == "edge")
    {
      receivedMessage.channel.send(rollDice());
    }
    else if(arguments == "heart")
    {
      receivedMessage.channel.send(rollDice());
    }
    else if (arguments == "iron") 
    {
      receivedMessage.channel.send(rollDice());
    }
    else if (arguments == "shadow") 
    {
      receivedMessage.channel.send(rollDice());
    }
    else if (arguments == "wits") 
    {
      receivedMessage.channel.send(rollDice());
    }
    else {
      receivedMessage.channel.send(rollDice());
    }
  }
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
    receivedMessage.channel.send("This is a bot for playing the tabletop RPG Ironsworn on your server. Type ? and then a command to learn more. The commands are: dice, ");
  }
}

client.login(bot_secret_token);