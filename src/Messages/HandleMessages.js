const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const nodeHtmlToImage = require('node-html-to-image')
const {roles, shiftroles} = require('../Commands/assign-roles.js');
const {addXpToUser, setPokemon, setObject, addGuildCoin, getUserInfo, addFightWin, sellObject} = require('../db/utility.js');
const levelUser = require('../db/levelling.js');
const bestemmia = require('../UnCommands/bestemmia.js')
const {getRandomPokemon, getPokemonEmoji, calculateDamage, calculateInitialStats, getPokemonDescription} = require('../Creatures/pokemon.js')
const {discoverTreasure, getObjectInfo} = require('../Commands/guildfantasyobject.js')

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

    const emojiName = '069';
    const emoji = msg.guild.emojis.cache.find(emoji => emoji.name === emojiName);
    if (emoji) {
        console.log(`ID of ${emojiName}: ${emoji.id}`);
    } else {
        console.log(`Emoji "${emojiName}" not found in the server.`);
    }

});
}


function underDevelopement(msg){
    const rand = Math.floor(Math.random() * underDev.length);
    msg.reply(underDev[rand]);
}