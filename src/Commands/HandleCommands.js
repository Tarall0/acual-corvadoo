const {canSpin, spinWheel} = require('./SpeenWheel.js');
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
            case 'profilename':
                const usernick = i.options.getString('usernick');
                try {
                    await i.member.setNickname(usernick);
                    await i.reply(`Your profile name has been updated to: ${usernick}`);
                } catch (error) {
                    console.error('Failed to set nickname:', error);
                    await i.reply('Failed to update your profile name. Please try again later.');
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
                .setTitle("About Title")
                .setDescription("Description about Corvado Bot - Corvado is currently under developement")
                .setColor('Random')
                .addFields({
                    name: "Commands Available",
                    value: "\n - **/randommeme**\n- **/insult** {username} \n- **/poll** {question} {option 1} {emoji 1} {option 2} {emoji 2} - duration",
                    inline: true
                },
                {
                    name: "Descriptions",
                    value: "\n- *Random meme fetched from API*\n- *Corvado will insult someone for you* \n- *Emoji based poll feature, add a question and emojis*",
                    inline: true
                });
                i.reply({embeds: [about]});
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
