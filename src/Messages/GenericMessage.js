const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Embed } = require('discord.js');

const {roles, shiftroles} = require('../Commands/assign-roles.js');
const {addXpToUser, setPokemon} = require('../db/utility.js');
const levelUser = require('../db/levelling.js');
const bestemmia = require('../UnCommands/bestemmia.js')
const getRandomPokemon = require('../Commands/pokemon.js')

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

    /** const emojiName = 'snorlax';
    const emoji = msg.guild.emojis.cache.find(emoji => emoji.name === emojiName);
    if (emoji) {
        console.log(`ID of ${emojiName}: ${emoji.id}`);
    } else {
        console.log(`Emoji "${emojiName}" not found in the server.`);
    } */

    


    /** ! Commands (Unofficial commands available) */

    if (msg.content.startsWith('!pokemon')) {
        const { pokemon, emoji } = getRandomPokemon(client);
        if (emoji) {
          
            msg.channel.send(`${emoji}`);
            msg.channel.send(`${pokemon}`);
            msg.channel.send('`Vuoi catturare il pokemon?`').then((sentMessage) => {
                // Add reactions for capturing and leaving the pokemon
                sentMessage.react('✅'); // Check mark emoji for capture
                sentMessage.react('❌'); // X emoji for leaving
              
                // Create a filter to only collect reactions from the message author
                const filter = (reaction, user) => ['✅', '❌'].includes(reaction.emoji.name) && user.id === msg.author.id;
              
                // Collect reactions
                sentMessage.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] })
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
                })
                .catch(collected => {
                    msg.channel.send(`${pokemon} escaped rip`);
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