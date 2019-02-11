const Discord = require('discord.js');
var auth = require('./auth.json');
var fs = require('fs');
var charsheet = require('./charsheet.js');
const client = new Discord.Client();
const logfile = "console.log";
var characters = [];

// START CONSTANTS
var stats = ['edge', 'heart', 'iron', 'shadow', 'wits'];
// END CONSTANTS

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
  //ZOMBIE CODE
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

function formatDiceString(rollObj)
{
  return `[${rollObj.d6 - rollObj.modifier}] + ${rollObj.modifier} vs <${rollObj.d1}> <${rollObj.d2}>`;
}

function rollDice(modifier=0)
{
  //rolls 1d6+modifier and checks to see how many d10s its greater than.
  let d6 = Math.floor(Math.random() * (6 - 1 + 1)) + 1 + modifier;
  let d1 = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  let d2 = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  console.log("Rolling dice with modifier = " + modifier);
  console.log("D6: " + d6);
  console.log("D10 1: " + d1);
  console.log("D10 2: " + d2);
  let rollObj = { critical: (d1 == d2), d6: d6, d1: d1, d2: d2, modifier: modifier };

  if((d1 >= d6) && (d2 >= d6))
  {
    rollObj.type = "Miss";
  }
  else if ((d1 < d6) && (d2 < d6))
  {
    rollObj.type = "Strong-Hit";
  }
  else if((d1 < d6) || (d2 < d6))
  {
    rollObj.type = "Weak-Hit";
  }
  else 
  {
    throw "Error: Dice roller yielded an invalid result: " + formatDiceString(rollObj);
  }

  return rollObj;
}

function rollStat(character, stat)
{
  if(character != null)
  {
    console.log(character.name + " rolling stat on: " + stat);
    console.log(stats);
    if(stats.includes(stat))
    {
      return rollDice(character[stat]);
    }
  }
  console.log("lookup_failed");

  // stat was not valid, roll a blank die and report it
  let result = rollDice();
  result.failed_lookup = true;
  return result;
}

function fetchCharacter(name)
{
  for(let i = 0; i < characters.length; i++)
  {
    if(characters[i].name == name) return characters[i];
  }

  return null;
}

function parseCommand(receivedMessage)
{
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
    let character = fetchCharacter(arguments[0]);
    console.log("character = " + character);
    let result = rollStat(character, arguments[1]);
    let prefix = (character != null) ? character.name + " rolls" : "Rolling";
    if(result.failed_lookup)
    {
      let roll_tag = character == null ? (arguments.length > 0 ? " " + arguments.join(" ") : "") : (arguments.length > 1 ? " " + arguments.slice(1).join(" ") : "");
      receivedMessage.channel.send(prefix + roll_tag + ":\n" + formatDiceString(result));
    }
    else
    {
      let roll_tag = arguments.length > 2 ? (" " + arguments.slice(2).join(" ")) : "";
      receivedMessage.channel.send(prefix + " " + arguments[1] + " check" + roll_tag + ":\n" + formatDiceString(result));
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
  else if(command == "endvote")
  {
    voteEnd(arguments, receivedMessage);
  }
}

function generateCharacter(arguments, receivedMessage)
{
  let new_character = new charsheet.CharacterSheet();
  new_character.owners.push(receivedMessage.author);
  new_character.name = arguments[0];
  new_character.edge = parseInt(arguments[1]);
  new_character.heart = parseInt(arguments[2]);
  new_character.iron = parseInt(arguments[3]);
  new_character.shadow = parseInt(arguments[4]);
  new_character.wits = parseInt(arguments[5]);
  characters.push(new_character);
  charmessage = `${new_character.owners[0]} created ${new_character.name}, an Ironsworn character with Edge: ${new_character.edge}, Heart: ${new_character.heart}, Iron: ${new_character.iron}, Shadow: ${new_character.shadow}, and Wits: ${new_character.wits}.`;
  receivedMessage.channel.send(charmessage);
}

function voteStart(arguments, receivedMessage)
{
  //check to see if the person asking for the vote owns a character, then set that character to a state of voting
  let hascharacter = false;
  let activeCharacter = null;
  for(let i = 0; i < characters.length; i++)
  {
    if (characters[i].owners.includes(receivedMessage.author) && characters[i].state == 'active' && characters[i].name == arguments[0])
    {
      hascharacter = true;
      characters[i].state = 'voting';
      activeCharacter = characters[i];
      break;
    }
  }
  if (!hascharacter) return;
  activeCharacter.vote_results = {};
  args = arguments.join(" ").split("|");
  for(let i = 1; i <args.length; i++)
  {
    args[i] = args[i].trim();
  }
  finalMessage = `${activeCharacter.name} has asked the Oracle. Please enter !, then the characters name, then the number of the option you want to vote for: \n`;
  for (let i = 1; i < args.length; i++)
  {
    //votes will be stored an array of the usernames of the voters
    activeCharacter.vote_results[i] = {'message': args[i], 'votes': []};
    finalMessage = finalMessage + `${i}: ${args[i]}\n`;
  }
  console.log(finalMessage);
  receivedMessage.channel.send(finalMessage);
}

function voteEnd(arguments, receivedMessage)
{
  let hascharacter = false;
  let activeCharacter = null;
  for(let i =0; i < characters.length; i++)
  {
    if (characters[i].owners.includes(receivedMessage.author) && characters[i].state == 'voting' && characters[i].name == arguments[0])
    {
      hascharacter = true;
      characters[i].state = 'active';
      activeCharacter = characters[i];
      break;
    }
  }
  if (!hascharacter) return;
  finalMessage = `The Oracle has decided ${activeCharacter.name}'s fate. \n`;
  results = [];
  for(let prop in activeCharacter.vote_results)
  {
    if (Object.hasOwnProperty(prop))
    {
      results.push({'message': prop.message, 'votes': prop.votes.length});
    }
  }
  results.sort((a,b) => {return a.votes - b.votes;});
  for(let i = 0; i < results.length; i++)
  {
    if(i == 0)
    {
      finalMessage += `The winner is: ${results[i].message} with ${results[i].votes} votes. \n`;
    }
    else {
      finalMessage += `${results[i].message} got ${results[i].votes} votes. \n`;
    }
  }
  receivedMessage.channel.send(finalMessage);
}

function characterCommand(args, receivedMessage)
{
  activeCharacter = null;
  found = false;
  for(let i = 0; i < characters.length; i++)
  {
    if (characters[i].name === args[0])
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

//args should be the recieved message as arguments (Command) (character) (attribute)
function faceDanger(character, args, receivedMessage)
{
  // TODO half this function isn't written
  let result = rollStat(character, args[2]);
  if(result.type == 'Strong-Hit')
  {
    character.addMomentum(1);
  }
  else if(result.type == 'Weak-Hit')
  {
    
  }
  else if(result.type == 'Miss')
  {

  }
}

function parseHelp(receivedMessage)
{
  let fullMessage = receivedMessage.content.substr(1);
  if (fullMessage === "")
  {
    helpAll("", receivedMessage);
  }
  return;
}

function helpAll(args, receivedMessage)
{
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