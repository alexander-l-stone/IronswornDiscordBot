const Discord = require('discord.js');
var auth = require('./auth.json');
var fs = require('fs');
var charsheet = require('./charsheet.js')
const client = new Discord.Client();
const logfile = "console.log";
var characters = [];

client.on('ready', () => {
  // List servers the bot is connected to
  console.log("Servers:");
  fs.appendFile(logfile, 'Server: \n', function(err) 
  {
    if (err) 
    {
      console.log("Error writing file!");
      throw err;
    }
  });
  client.guilds.forEach((guild) => {
      console.log(" - " + guild.name);
      fs.appendFile(logfile," - " + guild.name + "\n", function (err) {
        if (err) 
        {
          console.log("Error writing file!");
          throw err;
        }
      });
      // List all channels
      guild.channels.forEach((channel) => {
          console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
          fs.appendFile(logfile, ` -- ${channel.name} (${channel.type}) - ${channel.id}\n`, function (err) {
            if (err) 
            {
              console.log("Error writing file!");
              throw err;
            }
          });
      });
  });
  // console.log("Loading Characters");
  // fs.appendFile(logfile, 'Loading Characters \n', function (err) {
  //   if (err) throw err;
  //   console.log("Error writing file!");
  // });
  // if (fs.existsSync('characters.json')) {
  //   charjson = require('./characters.json');
  //   console.log(charjson);
  //   characters = JSON.parse(charjson);
  //   fs.appendFile(logfile, 'Characters Loaded \n', function (err) {
  //     if (err) throw err;
  //     console.log("Error writing file!");
  //   });
  // }
  // else{
  //   fs.appendFile(logfile, 'No Characters to Load\n', function (err) {
  //     if (err) throw err;
  //     console.log("Error writing file!");
  //   });
  // }
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

// client.on('disconnect', () =>{
//   jsonchars = JSON.stringify(characters);
//   fs.writeFile('characters.json', `"characters": ${jsonchars}`, function(err) {
//     if (err) throw err;
//     console.log("Error saving characters");
//   });
// })

function rollDice(modifier=0){
  //rolls 1d6+modifier and checks to see how many d10s its greater than.
  let d6 = Math.floor(Math.random() * (6 - 1 + 1)) + 1 + modifier;
  let d1 = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  let d2 = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  console.log("D6: " + d6);
  console.log("D10 1: " + d1);
  console.log("D10 2: " + d2);
  if((d1 >= d6) && (d2 >= d6) && (d1 !== d2))
  {
    return `Miss [${d6 - modifier}] + ${modifier} vs <${d1}> <${d2}>`;
  }
  else if ((d1 >= d6) && (d2 >= d6) && (d1 === d2))
  {
    return `Miss Critical [${d6 - modifier}] + ${modifier} vs <${d1}> <${d2}>`;
  }
  else if ((d1 < d6) && (d2 < d6) && (d1 !== d2))
  {
    return `Strong-Hit [${d6 - modifier}] + ${modifier} vs <${d1}> <${d2}>`;
  }
  else if((d1 < d6) && (d2 < d6) && (d1 === d2))
  {
    return `Strong-Hit Critical [${d6 - modifier}] + ${modifier} vs <${d1}> <${d2}>`;
  }
  else if((d1 < d6) || (d2 < d6) && (d1 !== d2))
  {
    return `Weak-Hit [${d6 - modifier}] + ${modifier} vs <${d1}> <${d2}>`;
  }
  else if ((d1 < d6) || (d2 < d6) && (d1 === d2)) {
    return `Weak-Hit Critical [${d6 - modifier}] + ${modifier} vs <${d1}> <${d2}>`;
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
    if (err) 
    {
      console.log("Error writing file!");
      throw err;
    }
  });

  if(command == 'roll')
  {
    //TODO: Put in a function
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
  else if(command == 'startvote')
  {
    voteStart(arguments, receivedMessage);
  }
  else if(command == 'createcharacter')
  {
    generateCharacter(arguments, receivedMessage);
  }
  else if(characters.includes(command))
  {
    characterCommand(arguments, receivedMessage);
  }
}

function generateCharacter(arguments, receivedMessage){
  let new_character = new charsheet.CharacterSheet();
  new_character.owners.push(receivedMessage.author);
  new_character.charname = arguments[0];
  new_character.edge = parseInt(arguments[1]);
  new_character.heart = parseInt(arguments[2]);
  new_character.iron = parseInt(arguments[3]);
  new_character.shadow = parseInt(arguments[4]);
  new_character.wits = parseInt(arguments[5]);
  characters.push(new_character);
  charmessage = `${new_character.owners[0]} created ${new_character.charname}, an Ironsworn character with Edge: ${new_character.edge}, Heart: ${new_character.heart}, Iron: ${new_character.iron}, Shadow: ${new_character.shadow}, and Wits: ${new_character.wits}.`;
  receivedMessage.channel.send(charmessage);
}

function voteStart(arguments, receivedMessage){
  //check to see if the person asking for the vote owns a character, then set that character to a state of voting
  let hascharacter = false;
  let activeCharacter = null;
  for(let i = 0; i < characters.length; i++)
  {
    if (characters[i].owners.includes(receivedMessage.author) && characters[i].state == 'active' && characters[i].charname == arguments[0])
    {
      hascharacter = true;
      characters[i].state = 'voting';
      activeCharacter = characters[i];
      break;
    }
  }
  if (!hascharacter)
  {
    return;
  }
  activeCharacter.vote_results = {};
  args = arguments.join(" ").split("|");
  for(let i = 1; i <args.length; i++)
  {
    args[i] = args[i].trim();
  }
  finalMessage = "The Oracle has been asked to decide. Please enter !, then the characters name, then the number of the option you want to vote for: \n";
  for (let i = 1; i < args.length; i++)
  {
    //votes will be an array of usernames
    activeCharacter.vote_results[i] = {'message': args[i], 'votes': []};
    finalMessage = finalMessage + `${i}: ${args[i]}\n`;
  }
  console.log(finalMessage);
  receivedMessage.channel.send(finalMessage);
}

function characterCommand(args, receivedMessage) {
  activeCharacter = null;
  found = false;
  for(let i = 0; i < characters.length; i++)
  {
    if (characters[i].charname === args[0])
    {
      activeCharacter = characters[i];
      found = true;
    }
  }
  if (!found) return;
  //code for managing character votes
  if(activeCharacter.state === 'voting')
  {
    if (!activeCharacter.vote_results[args[1]].includes(receivedMessage.author))
      {
        activeCharacter.vote_results[args[1]].push(receivedMessage.author);
      }
  }
}

function parseHelp(receivedMessage){
  let fullMessage = receivedMessage.content.substr(1);
  if (fullMessage === "")
  {
    helpAll("", receivedMessage);
  }
  return;
}

function helpAll(args, receivedMessage) {
  if (args === "")
  {
    receivedMessage.channel.send("This is a bot for playing the tabletop RPG Ironsworn on your server. Type ? and then a command to learn more. The commands are: roll, startvote [character]");
  }
  else if (args === "roll")
  {
    receivedMessage.channel.send("This will roll the dice and generate a result for you. By default this dice roll has no modifiers.");
  }
  else if (args === "startvote")
  {
    receivedMessage.channel.send("This will allow people to vote for one of various options. The vote will be tied to a specific character. Enter a characters name, and then a |, then each option you want to be voted on, seperating them with |'s.");
  }
}

client.login(bot_secret_token);