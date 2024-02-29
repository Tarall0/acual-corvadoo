const {canSpin, spinWheel} = require('./SpeenWheel.js');
const {addXpToUser, getUserInfo} = require('../db/utility.js');
const nodeHtmlToImage = require('node-html-to-image')
const {getPokemonDescription} = require('./pokemon.js');

const {EmbedBuilder} = require('discord.js');
const getCryptoInfo = require('./CryptoInfo.js');
const axios = require('axios');

module.exports = function(client){
    client.on('interactionCreate', async (i) => {
        if(!i.isChatInputCommand()) return;
        
        switch(i.commandName){
            case 'test':
                i.reply("Test success");
                break;
            case 'add':
                const a = i.options.get('number1');
                const b = i.options.get('number2');
                i.reply(`**Random Command** -- Sum is${(a + b)}`);
                break;
            case 'spinwheel':
                if (canSpin(i.member.id)) {
                    spinWheel(i);
    
                } else {
                    i.reply("Hai raggiunto il limite di spin disponibili al momento");
                }
                break;
            case 'profileinfo':
                const userInfo = await getUserInfo(i.guild.id, i.member.id);

                const pokedesc = getPokemonDescription(userInfo.guildpokemon);
                const xp_currentLevel = userInfo.level * 1000; //total experience required for the current level
                const remainingExp = xp_currentLevel - userInfo.exp; // Remaining experience needed to reach the next level
                const exp = ((xp_currentLevel - remainingExp) / xp_currentLevel) * 100;
                const admin = userInfo.gandalf ? "Server Admin" : " ";

                i.reply("Ecco il tuo profilo");

                if (userInfo && userInfo.username) { // Check if userInfo is not null or undefined, and username is available
                    // Create an embed to display user information
                    /**const embed = new EmbedBuilder()
                        .setTitle(`Profile Information - ${userInfo.username}`)
                        .setThumbnail(i.member.displayAvatarURL({size: 64}))
                        .setColor('#4B0082')
                        .addFields(
                            { name: 'Guild Pokemon', value: `*${userInfo.guildpokemon}*` },
                            //{ name: '\u200B', value: '\u200B' },
                            { name: 'Experience', value: `${userInfo.exp}`, inline: true },
                            { name: 'Level', value: `${userInfo.level}`, inline: true },
                        )
                        .setTimestamp()

                    // Send the embed
                    i.reply({ embeds: [embed] }); */

                    const _htmlTemplateProfile = `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                        <style>
                        body {
                            font-family: "Roboto", monospace;
                            background: rgb(22, 22, 22);
                            color: #fff;
                            max-width: 320px;
                        }
                    
                        .profile {
                            max-width: 320px;
                            height: 100%;
                            padding: 1em;
                            border-top: 3px solid rgb(153, 51, 255);
                            background: rgb(31, 31, 31);
                            position: relative;
                        }
                    
                        .profile-box {
                            display: flex; /* Change from grid to flex */
                            flex-direction: column; /* Stack children vertically */
                            align-items: center; /* Center align children horizontally */
                            gap: 10px; /* Add some space between children */
                        }
                    
                        .profile-user,
                        .profile-experience {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                        }
                    
                        .profile-experience {
                            position: relative;
                            margin-top: -2em;
                        }
                    
                        .profile-experience .exp {
                            position: absolute;
                            top: 23px;
                            left: 50%;
                            transform: translateX(-50%);
                            font-size: 12px;
                        }
                    
                        .box-experience {
                            background: rgb(120, 120, 120, .3);
                            width: 150px;
                            text-align: center;
                            padding: 3px;
                            margin: 1em auto;
                            height: 7px;
                            border-radius: 5px;
                        }
                    
                        .progress {
                            width: ${exp}% !important;
                            height: 100%;
                            background-color: #4caf50;
                            border-radius: 5px;
                        }
                    
                        .profile-img img {
                            width: 50px;
                            height: 50px;
                            margin-right: 20px;
                            border-radius: 50%;
                            border: 2px solid rgb(153, 51, 255);
                            padding: 2px;
                        }
                    
                        .profile-level {
                            margin-top: -2.5em;
                        }
                    
                        .pokemon {
                            background: rgb(120, 120, 120, .3);
                            padding: 10px 8px;
                            border-radius: 5px;
                            width: 250px; /* Increase width to accommodate content */
                            margin: 1em auto;
                            text-align: center; /* Center align content */
                        }

                        .pokemon .title{
                            margin-top: -18px;
                            text-shadow: 1px 1px black;
                            font-size: 14px;
                        }

                        .pokemon p{
                            font-size: 12px;
                        }

                        .admin{
                            position: absolute;
                            bottom: 10px;
                            right: 10px;
                            font-size: 12px;
                            color: rgb(153, 51, 255);
                        }

                    </style>
                    

                    </head>
                    <body>
                        <div class="profile">
                            <div class="profile-box">
                                <div class="profile-user">
                                    <div class="profile-img">
                                        <img src="${i.member.displayAvatarURL()}">
                                    </div>
                
                                    <h3>${userInfo.username}</h3>
                                </div>
                                <div class="profile-level">
                                    <h5>LVL ${userInfo.level}</h5>
                                </div>
                                <div class="profile-experience">
                                    <div class="box-experience">
                                        <div class="progress">
                                        </div>
                                    </div>
                                    <div class="exp">
                                        ${userInfo.exp}
                                    </div>
                                </div>

                                <div class="pokemon">
                                    <p class="title"> <b>Guild Pokemon</b>: <i>${userInfo.guildpokemon}</i></p>
                                    <p>${pokedesc}</p>
                                </div>

                                <div class="admin">
                                    ${admin}
                                </div>
                            </div>

                        </div>
                    </body>
                    </html>
                    `
        
                    const images = await nodeHtmlToImage({
                        html: _htmlTemplateProfile,
                        quality: 100,
                        type: 'jpeg',
                        puppeteerArgs: {
                        args: ['--no-sandbox'],
                        },
                        encoding: 'buffer',
                    })
                    // for more configuration options refer to the library
                    console.log(images)
        
            
                    i.channel.send({ files: [images] });
                   
                 

                } else {
                    i.reply('User information not found or incomplete.');
                }
                break;
            case 'randommeme':
                try {
                    const meme = await fetchRandomMeme();
                    if (meme) {
                        i.reply(meme);
                    } else {
                        i.reply("Sorry, couldn't fetch a meme right now.");
                    }
                } catch (error) {
                    console.error('Error fetching meme:', error);
                    i.reply("Sorry, couldn't fetch a meme right now.");
                }
                break;
            case 'insult':
                const name = i.options.getString('username');
                const insults = [
                    "you suck",
                    "you should consider becoming a superhost",
                    "you're about as much use as a condom machine in the Vatican.",
                    "may look like an idiot and talk like an idiot but don't let that fool you. He really is an idiot.",
                    "you bowl like your momma. Unless of course she bowls well, in which case you bowl nothing like her.",
                    "I'd insult you, but nature has already done a better job.",
                    "if laughter is the best medicine, your face must be curing the world.",
                    "you're not stupid; you just have bad luck when thinking.",
                    "I would challenge you to a battle of wits, but I see you're unarmed.",
                    "I've been asked to insult you... should I really do it?",
                    "cagati in mano e prenditi a schiaffi",
    
                ];
                const rand_insult = Math.floor(Math.random() * insults.length);
                i.reply(`${name} ${insults[rand_insult]}`);
                break;
    
            case 'cryptoinfo':
                const cryptoName = i.options.getString('cryptoname');
                try {
                    const info = await getCryptoInfo(cryptoName);
            
                    if (info) {
                        const img = getCryptoImg(cryptoName);
                        i.reply(`Here the current information about **${cryptoName}**`)
                        .then(
                            setTimeout(() => {
                                i.channel.send(info);
                            }, 1000)
                        );
                        
                    } else {
                        i.reply("Failed to retrieve cryptocurrency information");
                    }
                } catch (error) {
                    console.error("Error retrieving cryptocurrency information:", error);
                    i.reply("An error occurred while retrieving cryptocurrency information");
                }
                break;
    
    
            case 'poll':
                const question = i.options.getString('question');
                const option1 = i.options.getString('option1');
                const emoji1 = i.options.getString('emoji1');
                const option2 = i.options.getString('option2');
                const emoji2 = i.options.getString('emoji2');
                const duration = i.options.getInteger('duration') || 60;
    
                const minutes = Math.round(duration / 60);
                let unit = "";
    
                if(minutes != 1){
                    unit = "s";
                } else if(minutes < 1){
                    minutes = 1;
                }
    
            
                            
                // Construct a poll embed
                const pollEmbed = new EmbedBuilder()
                    .setTitle("📊 New Poll")
                    .setDescription(`**${question}**\n\n${emoji1} ${option1}\n${emoji2} ${option2}\n\n*This poll will be closed in ${minutes} minute${unit}*`)
                    .setColor(0x71368A);
                            
                const pollMessage = await i.reply({ embeds: [pollEmbed], fetchReply: true });
                
                // Add reactions to the poll message
                await pollMessage.react(emoji1);
                await pollMessage.react(emoji2);
                
                const filter = (reaction, user) => {
                    // Check if the reaction is emoji1 or emoji2
                    const isAllowedEmoji = [emoji1, emoji2].includes(reaction.emoji.name);
                
                    // Always remove the reaction if it's not one of the allowed emojis
                    if (!isAllowedEmoji) {
                        reaction.users.remove(user.id).catch(err => console.error(`Error removing reaction: ${err}`));
                    }
                
                    // Check if the user is the command initiator or if it's an allowed emoji
                    return user.id === i.user.id || isAllowedEmoji;
                }; 
    
                // Initialize an empty Set to store user IDs who have voted for this poll
                const votedThisPoll = new Set();
                    
                const collector = pollMessage.createReactionCollector({ filter, time: duration * 1000 });
                    
                // Initialize counts outside the collector
                let countOption1 = 0;
                let countOption2 = 0;
    
                collector.on('collect', async (reaction, user) => {
                    if (!user.bot){
                        if (votedThisPoll.has(user.id)) {
                            // If the user has already voted, remove the reaction
                            reaction.users.remove(user.id).catch(err => console.error(`Error removing reaction: ${err}`));
                            i.followUp({ content: "You have already voted for this poll", ephemeral: true })
                            .catch(console.error);
                        } else {
                            // If the user hasn't voted, add them to the voted users list
                            votedThisPoll.add(user.id);
                            // Process the vote as before
                            if (reaction.emoji.name === emoji1) {
                                countOption1 += 1;
                            } else if (reaction.emoji.name === emoji2) {
                                countOption2 += 1;
                            }
                            i.followUp({ content: "Thank you for voting in the poll", ephemeral: true })
                            .catch(console.error);
                            console.log(`${user.tag} reacted with ${reaction.emoji.name}`);
                        }
                    }
                });
    
                collector.on('end', collected => {
                    // Send a message when the poll is closed
                    i.followUp({ content: `*The Poll has now been closed. Thank you for participating. 👽*` });
    
                    // Send the results of the poll as an embed
                    const resultsEmbed = new EmbedBuilder()
                        .setTitle("📊 Poll Results")
                        .setDescription(`\n\n*${question}*\n\n${emoji1} ${option1} (${countOption1})\n${emoji2} ${option2}  (${countOption2})`)
                        .setColor('Random');
    
                    i.followUp({ embeds: [resultsEmbed] });
                });
                break;
            case 'permapoll': {
                const question = i.options.getString('question');
                const option1 = i.options.getString('option1');
                const emoji1 = i.options.getString('emoji1');
                const option2 = i.options.getString('option2');
                const emoji2 = i.options.getString('emoji2');
                            
                // Construct a poll embed
                const pollEmbed = new EmbedBuilder()
                    .setTitle("📊 Poll for the community")
                    .setDescription(`**${question}**\n\n${emoji1} ${option1}\n${emoji2} ${option2}`)
                    .setColor(0x9B59B6);
                            
                const pollMessage = await i.reply({ embeds: [pollEmbed], fetchReply: true });
                
                // Add reactions to the poll message
                await pollMessage.react(emoji1);
                await pollMessage.react(emoji2);
    
                break;
            }
                
            case 'review':
                const starsOption = i.options.get('stars');
                const feedbackOption = i.options.get("feedback");
                        
                console.log('Stars Option:', starsOption);
                console.log('Feedback Option:', feedbackOption);
                    
                if (starsOption && feedbackOption) {
                    const stars = starsOption.value;
                    const comment = feedbackOption.value;
                    console.log(`stars: ${stars} - feedback: ${comment}`);
                    i.reply({ content: "Thank you for your feedback! ☺️", ephemeral: true });
                 } else {
                    console.error("Stars or feedback option is missing.");
                    i.reply({ content: "Error processing your review. Please try again.", ephemeral: true });
                }
                break;
                
            case 'about':
                const about = new EmbedBuilder()
                .setTitle("About Corvado BOT")
                .setURL('https://tarallo.dev/')
                .setAuthor({ name: 'Corvado Bot', iconURL: 'https://i.imgur.com/Fr9lv6Y.png', url: 'https://tarallo.dev ' })
                .setThumbnail('https://i.imgur.com/ODwYkai.png')
                .setDescription("Description about Corvado BotCorvado Bot is a bot designed for discord servers. Developed in javascript using discord.js. \n Corvado Bot has implemented a tiered system, where the user gathers experience with interactions on the server. \n\n Corvado has implemented a moderation system, to make staying on the server enjoyable for everyone. *It is not currently possible to set this option, under development*. - Corvado is currently under developement")
                .setColor('Random')
                .setFooter({ text: 'Corvado Bot', iconURL: 'https://i.imgur.com/Fr9lv6Y.png' })
                .addFields(
                    {
                        name: "Commands Available",
                        value: "\nUse **/corvado** for the list of commands available\n\n"
                    
                    },
                )
                
                
                i.reply({embeds: [about]});
                break;

            case 'corvado':
                const commands = new EmbedBuilder()
                    .setTitle("Commands Corvado")
                    .setDescription("Here is the list of commands Corvado currently support")
                    .setFooter({ text: 'Corvado Bot', iconURL: 'https://i.imgur.com/Fr9lv6Y.png' })
                    .addFields(
                        {
                            name: "Chat (!) Commands Available",
                            value: "- **!pokemon**: *A random pokemon will spawn in the server, will you capture it?*\n\n",
                        }
                    )
                    .addFields(
                        {
                            name: "Slash (/) Commands Available",
                            value: "- **/profileinfo**: *Show your server profile*\n- **/spinwheel**: Allow Corvado to unveil your destiny with a spin of the Wheel of Fortune\n- **/insult** {username}: Request Corvado to sprinkle a dash of playful banter upon someone special\n- **/poll** {question} {option 1} {emoji 1} {option 2} {emoji 2} - ? duration: *Ignite community engagement with an emoji-infused poll; pose a question and watch the responses flutter in*\n- **/cryptoinfo** {cryptoname}: *Returns crypto currency current stats from Coingecko API*\n- **/randommeme**: *Send a random meme from Heroky API*",
                        }
                        
                    );
                i.reply({embeds: [commands]});
                break;
        }
    
    })
}




/**random  Functions  */

async function fetchRandomMeme() {
    try {
        const response = await fetch('https://meme-api.com/gimme');
        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Error fetching meme:', error);
        return null;
    }
}
