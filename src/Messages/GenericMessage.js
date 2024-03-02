const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const nodeHtmlToImage = require('node-html-to-image')

const {roles, shiftroles} = require('../Commands/assign-roles.js');
const {addXpToUser, setPokemon, setObject, addGuildCoin, getUserInfo, addFightWin} = require('../db/utility.js');
const levelUser = require('../db/levelling.js');
const bestemmia = require('../UnCommands/bestemmia.js')
const {getRandomPokemon, getPokemonEmoji, calculateDamage, calculateInitialStats, getPokemonDescription} = require('../Commands/pokemon.js')
const {discoverTreasure} = require('../Commands/guildfantasyobject.js')

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

    

    //** TEST */


    if (msg.content.startsWith("!updates")) {
        // Check if the user is an admin or moderator
        if (msg.member.permissions.has("ADMINISTRATOR") || msg.member.roles.cache.some(role => role.name === "Moderator")) {
            // Extract the notification message from the command
            const notificationMessage = msg.content.slice("!updates".length).trim();
    
            // Create the embed message
            const embed = new EmbedBuilder()
                .setColor('#4B0082')
                .setTitle("📣 | Guild Updates")
                .setDescription(notificationMessage)
                .setTimestamp();
    
            // Send the embed message to the channel
            msg.delete();
            msg.channel.send({embeds: [embed]});
        } else {
            // If user is not an admin or moderator, send a message indicating permission denial
            msg.channel.send("You don't have permission to use this command.");
        }
    }

    if (msg.content.startsWith("!treasure")) {
        try {
            const treasure = discoverTreasure();
    
            const treasureName = treasure.name;
            const treasureEmoji = treasure.emoji;
            const treasureDescription = treasure.description;
            const treasureRarity = treasure.rarity;
    
            // Construct embed
            const embedTreasure = new EmbedBuilder()
                .setTitle(`${msg.author.displayName} scopre un tesoro!`)
                .setDescription(`**${treasureName}**\n*${treasureDescription}*\nRarity: **${treasureRarity}**`);
            
            // Set embed color and footer based on rarity
            if (treasureRarity == 'Comune') {
                embedTreasure.setColor('Grey');
                embedTreasure.setFooter({ text: '⭐' });
                addXpToUser(msg.guild.id, msg.author.id, 30);
            } else if (treasureRarity == 'Raro') {
                embedTreasure.setColor('Blue');
                embedTreasure.setFooter({ text: '⭐⭐' });
                addXpToUser(msg.guild.id, msg.author.id, 60);
            } else if (treasureRarity == 'Epico') {
                embedTreasure.setColor('Purple');
                embedTreasure.setFooter({ text: '⭐⭐⭐' });
                addXpToUser(msg.guild.id, msg.author.id, 120);
            } else if (treasureRarity == 'Leggendario') {
                embedTreasure.setColor('Gold');
                embedTreasure.setFooter({ text: '⭐⭐⭐⭐' });
                addXpToUser(msg.guild.id, msg.author.id, 250);
            }
    
            
            // Attempt to add object to user's inventory
            setObject(msg.guild.id, msg.author.id, treasureEmoji)
                .then(() => {
                    console.log("Object added successfully to user's inventory");
                    // Display treasure details
                    msg.channel.send(treasureEmoji);
                    // Send embed to channel
                    msg.channel.send({ embeds: [embedTreasure] });
                })
                .catch((err) => {
                    if (err.message === "User already has maximum number of objects.") {
                        msg.channel.send("Il tuo inventario è pieno");
                    } else {
                        console.error(err);
                        msg.channel.send("Errore durante il recupero del tesoro.");
                    }
                });
        } catch (err) {
            console.error(err);
            msg.channel.send("Errore durante il recupero del tesoro.");
        }
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

    let fightCollector;

if (msg.content.startsWith("!fight")) {
    const user = await getUserInfo(msg.guild.id, msg.author.id);
    const pokemon = user.guildpokemon;

    const enemypokemon = getRandomPokemon(client);
    let { health: enemyPokemonHealth, pokemonLevel: enemyPokemonLevel } = calculateInitialStats(enemypokemon.pokemon);
    let {health: yourPokemonHealth} = calculateInitialStats(pokemon);
    const emoji = getPokemonEmoji(enemypokemon.pokemon, client);

    const startFight = (interaction) => {
        // Simulate the fight
        while (true) {
            // Attack opponent
            enemyPokemonHealth -= calculateDamage(pokemon);
            // Check if enemy fainted
            if (enemyPokemonHealth <= 0) {
                winner = msg.author.username;
                addFightWin(msg.guild.id, msg.author.id);
                const xpWin = 80;
                addXpToUser(msg.guild.id, msg.author.id, xpWin);
                interaction.reply({ content: `Hai guadagnato ${xpWin} XP`, ephemeral: true });
                announceWinner(winner);
                break;
            }
    
            // Enemy attacks back
            yourPokemonHealth -= calculateDamage(enemypokemon.pokemon);
            // Check if player's Pokemon fainted
            if (yourPokemonHealth <= 0) {
                winner = enemypokemon.pokemon;
                const xpLose = 30;
                addXpToUser(msg.guild.id, msg.author.id, xpLose);
                interaction.reply({ content: `Hai guadagnato ${xpLose} XP`, ephemeral: true });
                announceWinner(winner);
                break;
            }
        }
    };
    
    // Function to announce the winner
    const announceWinner = (winner) => {
        msg.channel.send(`Il vincitore è ${winner}!`);
    };

    const fightButton = new ButtonBuilder()
        .setCustomId('fight')
        .setLabel('Fight')
        .setStyle(1);

    const escapeButton = new ButtonBuilder()
        .setCustomId('escape')
        .setLabel('Escape')
        .setStyle(2);

    const buttonRow = new ActionRowBuilder()
        .addComponents(fightButton, escapeButton);

    const fightEmbed = new EmbedBuilder()
        .setTitle(`${enemypokemon.pokemon} selvatico`)
        .setColor('DarkRed')
        .setDescription(`Punti Vita:  ${enemyPokemonHealth} | lvl ${enemyPokemonLevel}`)
        .setThumbnail(emoji.url); // Set the emoji as thumbnail

    msg.channel.send({ embeds: [fightEmbed], components: [buttonRow] })
        .then(sentMessage => {
            const filter = i => i.customId === 'fight' || i.customId === 'escape';
            fightCollector = msg.channel.createMessageComponentCollector({
                filter,
                time: 10000,
                dispose: true
            });

            fightCollector.on('collect', interaction => {
                if (interaction.customId === 'fight') {
                    startFight(interaction);
                    // Stop the collector and remove buttons
                    fightCollector.stop();
                    sentMessage.edit({ components: [] }).catch(console.error);
                } else if (interaction.customId === 'escape') {
                    // Handle escape logic
                    const xpEscape = 10;
                    // Handle escape logic
                    interaction.reply({ content: `Hai guadagnato ${xpEscape} XP`, ephemeral: true });
                    addXpToUser(msg.guild.id, msg.author.id, xpEscape);
    
                    msg.reply(`${msg.author.displayName} ha deciso di non combattere`);
                    fightCollector.stop();
                    sentMessage.edit({ components: [] }).catch(console.error);
                }
            });

            fightCollector.on('end', collected => {
                if (collected.size === 0) {
                    // If the collector ends due to timeout
                    msg.reply(`${enemypokemon.pokemon} selvatico è fuggito`);
                    sentMessage.edit({ components: [] }).catch(console.error);
                }
            });
        })
        .catch(err => {
            console.error('Error sending Pokémon message:', err);
        });
}

    
    if(msg.content.startsWith('!gold')){
        addGuildCoin(msg.guild.id, msg.author.id);
        console.log("Gold");
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

function emojiToUrl(emoji) {
    const unicode = emoji.codePointAt(0).toString(16);
    return `https://twemoji.maxcdn.com/v/latest/72x72/${unicode}.png`;
}