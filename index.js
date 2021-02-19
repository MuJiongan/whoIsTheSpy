const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));



const Discord = require("discord.js")
const bot = new Discord.Client()

const fs = require('fs');

bot.login(process.env.DISCORD_TOKEN)
bot.on('ready', () => {
    console.log('ready')
    bot.user.setActivity('谁是卧底 $play');
    
});
function embed(title, text){
    const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#ff8c00')
	.setTitle(title)
	.setDescription(text)
    return exampleEmbed
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function getWordComb() {
  var array = fs.readFileSync('word_list.txt').toString().split("\n");
  var ran_word_comb = getRandomInt(array.length)
  return array[ran_word_comb]
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

var players = {}
var spy_player = {}
var spy_word = {}
var word = {}
var spy = {}
var vote = {}
function key_in_dict(one_dict, two_dict, three_dict, four_dict, five_dict, six_dict, guild){
	return one_dict[guild] === undefined && two_dict[guild] === undefined && three_dict[guild] === undefined && four_dict[guild] === undefined && five_dict[guild] === undefined && six_dict[guild] === undefined
}

bot.on('message', message => {
  
	if (message.content === '$play'){
		vote[message.guild] = ''
		
		const start_game = 'Game has started!'
    console.log(message.author.username + " "+ message.author.id + ' started a game in ' + message.guild.name)
		const word_comb = getWordComb()
		if (getRandomInt(2) === 0) {
		  spy_word[message.guild] = word_comb.split(' ')[0]
		  word[message.guild] = word_comb.split(' ')[1]
		}
		else{
		  spy_word[message.guild] = word_comb.split(' ')[1]
		  word[message.guild] = word_comb.split(' ')[0]
		}
		
		const adding_player = embed('Adding players', 'Please add players(use command **$add @player**)\nAfter adding all the players, use command **$start** and all players will be assigned a word.')
		message.channel.send(start_game)
		message.channel.send(adding_player)
		players[message.guild] = []
	
	  }
	  else if (message.content.startsWith('$add') && players[message.guild] !== undefined) {
		const user = message.mentions.users.first();
		if (!players[message.guild].includes(user) && user !== undefined) {
		players[message.guild].push(user)
		message.channel.send(embed('Player added', "<@" + user + '> was added to the game.'))}
		else if(user === undefined){
			message.channel.send(embed('Error','Please tag the user you want to add.'))
		}
		else{
		  message.channel.send(embed('Error', "<@" + user + '> was already added to the game.'))
		}
		
	  }
	  else if (message.content === ('$getlist') && players[message.guild] !== undefined) {
		var list_people_text = ''
		if (players[message.guild].length === 0) {
		  list_people_text = 'nobody '
		}
		for (i = 0; i < players[message.guild].length; i++){
		  list_people_text = list_people_text + "<@" + players[message.guild][i].id + '>, '
		}
		message.channel.send(embed('Currently playing',list_people_text + 'is on the list'))
	  }

	  else if (message.content === '$start' && players[message.guild] !== undefined && spy_word[message.guild] !== undefined && word[message.guild] !== undefined) {
		if (players[message.guild].length <= 2){
		  message.channel.send(embed('Error', 'This game needs at least 3 players to play.'))
		}else{
		 const people = players[message.guild].length
		 players[message.guild] = shuffle(players[message.guild])
		 spy[message.guild] = getRandomInt(people)
     
		 spy_player[message.guild] = players[message.guild][spy[message.guild]]
     console.log(spy_player[message.guild].username + " is the spy in " + message.guild.name)

		 var i;
	   for (i = 0; i < people; i++) {
		 if (i !== spy[message.guild]){
		   
		   players[message.guild][i].send(embed(word[message.guild], "Just in case you don't know, here is the translation.\n" + 'https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb=' + word[message.guild])).catch()
		 }else {
		   
		   players[message.guild][i].send(embed(spy_word[message.guild], "Just in case you don't know, here is the translation.\n" + 'https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb=' + spy_word[message.guild])).catch()
		 }
	   }
		 
		 var order = ''
		 for (i = 0; i < players[message.guild].length; i++){
		   order = order + (i + 1).toString() + '. ' + "<@" + players[message.guild][i] + '>\n'
		 }
		 message.channel.send(embed('Here we go! Please describe the word you have in order:', order + '\n' + 'After everyone finishes speaking, use command **$kick @player** to kick the most voted player out of the game'))
		 
	   }
		
		 
	 
	   }
	   else if (message.content === '$changeword' && players[message.guild] !== undefined && (spy_word[message.guild] !== undefined || word[message.guild] !== undefined)) {
		if (players[message.guild].length <= 2){
			message.channel.send(embed('Error', 'This game needs at least 3 players to play.'))
		  }else{
		const word_comb = getWordComb()
		if (getRandomInt(2) === 0) {
		  spy_word[message.guild] = word_comb.split(' ')[0]
		  word[message.guild] = word_comb.split(' ')[1]
		}
		else{
		  spy_word[message.guild] = word_comb.split(' ')[1]
		  word[message.guild] = word_comb.split(' ')[0]
		}
		const people = players[message.guild].length
		 players[message.guild] = shuffle(players[message.guild])
		 spy[message.guild] = getRandomInt(people)
		 spy_player[message.guild] = players[message.guild][spy[message.guild]]
		 var i;
	   for (i = 0; i < people; i++) {
		 if (i !== spy[message.guild]){
		   
		   players[message.guild][i].send(embed(word[message.guild], "Just in case you don't know, here is the translation.\n" + 'https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb=' + word[message.guild])).catch()
		 }else {
		   
		   players[message.guild][i].send(embed(spy_word[message.guild], "Just in case you don't know, here is the translation.\n" + 'https://www.mdbg.net/chinese/dictionary?page=worddict&wdrst=0&wdqb=' + spy_word[message.guild])).catch()
		 }
	   }
		 
		 var order = ''
		 for (i = 0; i < players[message.guild].length; i++){
		   order = order + (i + 1).toString() + '. ' + "<@" + players[message.guild][i] + '>\n'
		 }
		 message.channel.send(embed('Here we go! Please describe the word you have in order:', order + '\n' + 'After everyone finishes speaking, use command **$kick @player** to kick the most voted player out of the game'))
		 
	   }}
	   else if (message.content === '$continue' && players[message.guild] !== undefined && vote[message.guild] !== undefined) {
		if (players[message.guild].length <= 2){
		  message.channel.send(embed('Error', 'This game needs at least 3 players to play.'))
		}else{
		 
		
		 
		 vote[message.guild] = ''
		 
		 var order = ''
		 for (i = 0; i < players[message.guild].length; i++){
		   order = order + (i + 1).toString() + '. ' + "<@" + players[message.guild][i] + '>\n'
		 }
		 message.channel.send(embed('Here we go! Please describe the word you have in order:', order + '\n' + 'After everyone finishes speaking, use command **$kick @player** to kick the most voted player out of the game'))
		  }
		
		 
	 
	   }
	   else if (message.content.startsWith('$kick') && players[message.guild] !== undefined && spy_player[message.guild] !== undefined && spy_word[message.guild] !== undefined && word[message.guild] !== undefined) {
		const user = message.mentions.users.first();
		if (!players[message.guild].includes(user)) {
		message.channel.send(embed('Error', "<@" + user + '> is not in the game or has already got kicked out of the game. Please kick someone who is playing.'))}
		else{
		  for (i = 0; i < players[message.guild].length; i++){
			if (players[message.guild][i] === user){
			  players[message.guild].splice(i, 1);
			  message.channel.send("<@" + user + '> kicked!')
			}
	
		  }
		  if (spy_player[message.guild].id !== user.id && players[message.guild].length > 2){
			message.channel.send(embed('Game continues', "Y'all got the wrong one. " + "<@" + user + '> is not the spy. \n' + "Game continues! Use command **$continue** to continue"))
		  }
		  else if (spy_player[message.guild].id === user.id && players[message.guild].length >= 2){
			message.channel.send('Spy got caught! Good job! \n')
			message.channel.send(embed('Game over', "<@" + spy_player[message.guild] + '> is the spy. \nHis/her word is ' + spy_word[message.guild] + '\n' + 'Other players have ' + word[message.guild]))
		  }else if (spy_player[message.guild].id !== user.id && players[message.guild].length === 2){
			message.channel.send('Spy won. \n')
			message.channel.send(embed('Game over', "<@" + spy_player[message.guild] + '> is the spy. \nHis/her word is ' + spy_word[message.guild] + '\n' + 'Other players have ' + word[message.guild]))
		  }else{message.channel.send(embed('Error', 'something went wrong! Please restart the game!'))}
	
		}
		
	  }
	  else if (message.content.startsWith('$vote') && vote[message.guild] !== undefined && players[message.guild] !== undefined){
		const user = message.mentions.users.first();
		if (players[message.guild].includes(user)){
		vote[message.guild] = vote[message.guild] + "<@" + message.author + '> voted for <@' + user + '>\n'
		message.channel.send(embed('Vote', vote[message.guild]))}
		else{
		message.channel.send(embed('Vote','Please vote for someone at the game\n\n' + vote[message.guild]))}
		}
	else if (message.content === '$getvote' && vote[message.guild] !== undefined){
		if (vote[message.guild] === ''){
			message.channel.send(embed('Vote','Nobody has voted yet'))
	
		}else{
			message.channel.send(embed('Vote', vote[message.guild]))
		}
	}
	else if (message.content === '$clearvote' && vote[message.guild] !== undefined){
		vote[message.guild] = ''
		message.channel.send(embed('Vote', 'Vote has been cleared'))
	
	}
  
  // id = [ "543575401658712067", "272851216659120139"]
  // if (message.author.id === "272851216659120139"){
    
  //   message.react("🇨")
  //   message.react("🇴")
  //   message.react("🇸")
    

  // }
	

}
)