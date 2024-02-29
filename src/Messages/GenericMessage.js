const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, AttachmentBuilder, Attachment } = require('discord.js');
const nodeHtmlToImage = require('node-html-to-image')

const {roles, shiftroles} = require('../Commands/assign-roles.js');
const {addXpToUser, setPokemon} = require('../db/utility.js');
const levelUser = require('../db/levelling.js');
const bestemmia = require('../UnCommands/bestemmia.js')
const {getRandomPokemon} = require('../Commands/pokemon.js')

const {greetings, underDev} = require('./Responses.js');
const strike = require('../UnCommands/strike.js');


const channelID = "1204375490492891156";
const x_xpToAdd = 10;


module.exports = function(client) {
    client.on('messageCreate', async (msg) => {

    const caseInsensitiveContent = msg.content.toLowerCase();
    const guildId = msg.guild.id;
    const userId = msg.author.id;

    if(!msg.author.bot){
        const xpPerMsg = 5;
        levelUser(userId, guildId, msg.member);
        addXpToUser(guildId, userId, xpPerMsg);
    }

    if (msg.channel.id === channelID && msg.content.includes("https://")) {
        const emojis = ["🎶", "🎵", "🎤"];
        const randEmoji = Math.floor(Math.random() * emojis.length);
        msg.react("💜");
        msg.react(emojis[randEmoji]);
    }



    if(caseInsensitiveContent.includes("corvado")){
        const rand = Math.floor(Math.random() * greetings.length);
        
        const xpToAdd = 15;

        msg.reply(greetings[rand]);
        addXpToUser(guildId, userId, xpToAdd);

    }


    if(caseInsensitiveContent.includes("corvado search")){
        underDevelopement(msg);
    }

    if((caseInsensitiveContent.includes("corvado can you")) || (caseInsensitiveContent.includes("corvado could you")) || (caseInsensitiveContent.includes("corvado would you"))){
        underDevelopement(msg);
    }

    if(caseInsensitiveContent.includes("corvado what is") || caseInsensitiveContent.includes("corvado what kind") || caseInsensitiveContent.includes("corvado what should")){
        underDevelopement(msg);
    }


    switch (caseInsensitiveContent) {
        case 'patty':
            const rand = Math.floor(Math.random() * 2);

            if (rand) {
                msg.reply('?!');
            } else {
                msg.reply('salvatò');
                msg.react("🌶️");
            }

            addXpToUser(msg.guild.id, msg.author.id, x_xpToAdd);
            break;

        case 'strike':

            msg.reply(strike());
            msg.react("👊");

            addXpToUser(msg.guild.id, msg.author.id, x_xpToAdd);
            break;

        case 'cucu':
            msg.reply("rucu");
            msg.react("🦚");
            msg.react("🦜");
            addXpToUser(msg.guild.id, msg.author.id, x_xpToAdd);
            break;

        case 'signoraa':
            msg.reply("I limoniii");
            msg.react("🍋");
            addXpToUser(msg.guild.id, msg.author.id, x_xpToAdd);
            break;
    }

    const emojiName = 'pika';
    const emoji = msg.guild.emojis.cache.find(emoji => emoji.name === emojiName);
    if (emoji) {
        console.log(`ID of ${emojiName}: ${emoji.id}`);
    } else {
        console.log(`Emoji "${emojiName}" not found in the server.`);
    }

    

    //** TEST */

    if(msg.content.startsWith('!htmltest')){

            const name = 'Username';
            const level = "1";
            const experience = "444";
            const pokemon = "Picazzo";


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
                    max-width: 300px;
                }

                .profile-box {
                    max-width: 300px;
                    padding: 20px;
                    display: flex;
                    flex-direction: row;
                    border-top: 3px solid rgb(153, 51, 255);
                    background: rgb(31, 31, 31);
                    align-items: center;
                }

                .profile-img img{
                    width: 50px;
                    height: 50px;
                    margin-right: 20px;
                    border-radius: 50%;
                    border: 1px solid #fff;
                    padding: 5px;
                }


                </style>
            </head>
            <body>
                <div class="profile-box">
                    <div class="profile-img">
                        <img src="${img}">
                    </div>

                <h4>Welcome ${name}</h4>
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

            msg.channel.send({ files: [images] });
           
         }



    /** ! Commands (Unofficial commands available) */

    if (msg.content.startsWith('!pokemon')) {
        const { pokemon, emoji } = getRandomPokemon(client);
        if (emoji) {
          
            msg.channel.send(`${emoji}`);
            msg.channel.send(`**${pokemon}**`);
            msg.channel.send('` Vuoi catturare il pokemon? `').then((sentMessage) => {
                // Add reactions for capturing and leaving the pokemon
                sentMessage.react('✅'); // Check mark emoji for capture
                sentMessage.react('❌'); // X emoji for leaving
              
                // Create a filter to only collect reactions from the message author
                const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === msg.author.id;
              
                // Collect reactions
                sentMessage.awaitReactions({ filter, max: 1, time: 30000, errors: ['time'] })
                .then(collected => {
                    const reaction = collected.first();
                    if (reaction.emoji.name === '✅') {
                        // Capture the pokemon
                        setPokemon(msg.guild.id, msg.author.id, pokemon);
                        addXpToUser(msg.guild.id, msg.author.id, 50);
                        msg.channel.send(`*${msg.author.username} ha catturato ${pokemon}!*`);
                    } else if (reaction.emoji.name === '❌') {
                        // Leave the pokemon
                        msg.channel.send(`*${msg.author.username} ha deciso di non catturare ${pokemon}.*`);
                        addXpToUser(msg.guild.id, msg.author.id, 20);
                    } 
                    sentMessage.reactions.removeAll().catch(error => console.error('Failed to clear reactions:', error));
                })
                .catch(collected => {
                    msg.channel.send(`*${pokemon} è fuggito*`);
                });
            }).catch(err => {
                console.error('Error sending Pokémon message:', err);
            });
        } else {
            console.log("Error: Pokémon emoji not found.");
            msg.channel.send("Error: Pokemon emoji not found.");
        }
    }
    
    

    if (msg.content.startsWith('!assign-roles')) {
        const rolesx = roles;
        const components = rolesx.map(role => {
            const button = new ButtonBuilder()
                .setCustomId(role.label)
                .setLabel(role.label)
                .setStyle(2);
            return button;
        });
    
        const row = new ActionRowBuilder().addComponents(components);
    
        const embed = new EmbedBuilder()
            .setTitle('🪄 Selezione Ruoli del server')
            .setDescription('Benvenut*! Qui puoi scegliere i ruoli che preferisci. Clicca sui pulsanti sotto per aggiungere o rimuovere i ruoli.')
            .setColor('#4B0082');
    
        msg.channel.send({ embeds: [embed], components: [row] });
    }
    
    if (msg.content.startsWith('!shift-roles')) {
        const rolesy = shiftroles;
        const components = rolesy.map(role => {
            const button = new ButtonBuilder()
                .setCustomId(role.label)
                .setLabel(role.label)
                .setStyle(2);
            return button;
        });
    
        const row = new ActionRowBuilder().addComponents(components);
    
        const embed = new EmbedBuilder()
            .setTitle('⌛ Current Shift')
            .setDescription('Nightly warrior or Morning saviour?')
            .setColor('#4B0082');
    
        msg.channel.send({ embeds: [embed], components: [row] });
    }

    if(msg.content.startsWith("!bestemmia") && (msg.channel.id == '1204381121991934032')){
        msg.reply(bestemmia());
    }
    
    
} )
}

function underDevelopement(msg){
    const rand = Math.floor(Math.random() * underDev.length);
    msg.reply(underDev[rand]);
}