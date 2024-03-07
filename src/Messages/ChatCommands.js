const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const {roles, shiftroles} = require('../Commands/assign-roles.js');
const {addXpToUser, setPokemon, setObject, addGuildCoin, getUserInfo, addFightWin, sellObject} = require('../db/utility.js');
const bestemmia = require('../UnCommands/bestemmia.js')
const {getRandomPokemon, getPokemonEmoji, calculateDamage, calculateInitialStats, getPokemonDescription} = require('../Creatures/pokemon.js')
const {getRandomMerchant} = require('../Creatures/merchants.js')
const {discoverTreasure, getObjectInfo} = require('../Commands/guildfantasyobject.js')

module.exports = function(client) {
    client.on('messageCreate', async (msg) => {
        //** Chat commands for the Guild usage is !command */

        if (msg.content.startsWith("!merchant")) {
            const merchant = getRandomMerchant();

            const emoji = client.emojis.cache.get(merchant.emojiId);
    
        const merchantEmbed = new EmbedBuilder()
            .setTitle(merchant.name)
            .setDescription(merchant.description)
            .setThumbnail(emoji.url);
    
        msg.reply({ content: `Cosa vuoi fare con ${merchant.name}?`, embeds: [merchantEmbed], components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('vendi').setLabel('Vendi').setStyle(1),
                new ButtonBuilder().setCustomId('compra').setLabel('Compra').setStyle(3)
            )
        ] }).then(sentMessage => {
            const filter = interaction => interaction.user.id === msg.author.id;
            const collector = msg.channel.createMessageComponentCollector({ filter, time: 30000 });
    
            collector.on('collect', interaction => {
                if (interaction.customId === 'vendi') {
                    // If user clicks "Yes"
                    interaction.reply({ content: `Hai selezionato "Vendi"`, ephemeral: true });
                    sentMessage.edit({ components: [] }).catch(console.error);

                    const actionEmbed = new EmbedBuilder()
                        .setTitle("Quale oggetto vuoi offrire al mercante? Se non ricordi la posizione dei tuoi oggetti, usa **/inventory**")
                        .setDescription("Usa **!sell** *X* (numero da 1 a 6) per offrire l'oggetto al mercante.");
                    
                    msg.channel.send({embeds: [actionEmbed]});
                
                    collector.stop(); // Stop the collector to prevent further interactions
                
                    const filter = (response) => {
                        return response.author.id === msg.author.id && response.content.startsWith("!sell");
                    };
                
                    msg.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
                        .then(async collected => {
                            const sellCommand = collected.first().content;
                            // Perform the sell logic based on the sellCommand
                            const user = await getUserInfo(msg.guild.id, msg.author.id);
                            const objects = user.objects; // objects is an array
                        
                            // Extract the position from the sellCommand
                            const sellPosition = sellCommand.split(" ")[1]; // Assuming the command is like "!sell {position}"
                            const position = parseInt(sellPosition);
                
                            
                            if (!isNaN(position) && position >= 1 && position <= objects.length) {
                                const objectToSell = objects[position - 1]; // Arrays are 0-indexed
                                const objectInfo = getObjectInfo(objectToSell);
                                // Perform the logic to sell objectToSell
                                msg.channel.send(`*Hai selezionato ${objectToSell} per **${merchant.name}** *`);

                                const merchantEmbedSelling = new EmbedBuilder()
                                    .setTitle(merchant.name)
                                    
                                    .setThumbnail(emoji.url);

                                if (objectInfo.rarity && merchant.searches.includes(objectInfo.rarity)) {
                                    msg.channel.send(`Questo oggetto ${objectToSell} **${objectInfo.name}** interessa a **${merchant.name}**`);
                        

                                    merchantEmbedSelling.setDescription(`Per ${objectToSell} **${objectInfo.name}** riceverai **${objectInfo.price * 2} 💎 diamanti**\n *Se accetti lo scambio, non potrai annullarlo.*`);

                                    msg.channel.send({embeds: [merchantEmbedSelling], components: [
                                        new ActionRowBuilder().addComponents(
                                            new ButtonBuilder().setCustomId('sell').setLabel('Vendi').setStyle(3),
                                            new ButtonBuilder().setCustomId('cancel').setLabel('Annulla').setStyle(4)
                                        )
                                    ]}).then(sentMsgToSell => {
                                        const filter = interaction => interaction.user.id === msg.author.id;
                                        const collector = msg.channel.createMessageComponentCollector({ filter, time: 30000 });

                                        collector.on('collect', interaction => {
                                            if(interaction.customId == "sell"){
                                                interaction.reply(`${interaction.member.displayName} ha venduto  ${objectToSell} **${objectInfo.name}** al personaggio **${merchant.name}**`)
                                                sentMsgToSell.edit({ components: [] }).catch(console.error);
                                                sellObject(interaction.guild.id, interaction.member.id, objectToSell, objectInfo.price);
                                                addXpToUser(interaction.guild.id, interaction.member.id, 20);
                                                collector.stop();
                                                
                                            } else{
                                                interaction.reply(`${interaction.member.displayName} non ha concluso la trattativa per  ${objectToSell} **${objectInfo.name}** con **${merchant.name}**`)
                                                sentMsgToSell.edit({ components: [] }).catch(console.error);
                                                collector.stop();
                                            }
                                        })
                                    })
                                } else {
                                    msg.channel.send(`Questo oggetto ${objectToSell} **${objectInfo.name}** non sembra interessare a **${merchant.name}**`);
                        

                                    merchantEmbedSelling.setDescription(`Per ${objectToSell} **${objectInfo.name}** posso offrirti ** 2 💎 diamanti**\n *Se accetti lo scambio, non potrai annullarlo.*`);

                                    msg.channel.send({embeds: [merchantEmbedSelling], components: [
                                        new ActionRowBuilder().addComponents(
                                            new ButtonBuilder().setCustomId('sell').setLabel('Vendi').setStyle(3),
                                            new ButtonBuilder().setCustomId('cancel').setLabel('Annulla').setStyle(4)
                                        )
                                    ]}).then(sentMsgToSell => {
                                        const filter = interaction => interaction.user.id === msg.author.id;
                                        const collector = msg.channel.createMessageComponentCollector({ filter, time: 30000 });

                                        collector.on('collect', interaction => {
                                            if(interaction.customId == "sell"){
                                                interaction.reply(`${interaction.member.displayName} ha venduto  ${objectToSell} **${objectInfo.name}** al personaggio **${merchant.name}**`)
                                                sentMsgToSell.edit({ components: [] }).catch(console.error);
                                                sellObject(interaction.guild.id, interaction.member.id, objectToSell, objectInfo.price);
                                                addXpToUser(interaction.guild.id, interaction.member.id, 20);
                                                collector.stop();
                                                
                                            } else{
                                                interaction.reply(`${interaction.member.displayName} non ha concluso la trattativa per  ${objectToSell} **${objectInfo.name}** con **${merchant.name}**`)
                                                sentMsgToSell.edit({ components: [] }).catch(console.error);
                                                collector.stop();
                                            }
                                        })
                                    })
                                    
                                }
                                
                            } else {
                                msg.channel.send("Posizione non valida. L'interazione è stata annullata.");
                            }
                        })
                        .catch(() => {
                            msg.channel.send("Nessuna risposta rilevata. L'interazione è stata annullata.");
                        });
                    
                } else if (interaction.customId === 'compra') {
                    // If user clicks "No"
                    interaction.reply({ content: 'Attualmente non è possibile comprare oggetti dal mercante"', ephemeral: true });
                    // Remove the buttons and stop the collector
                    sentMessage.edit({ components: [] }).catch(console.error);
                    collector.stop();
                }
                
            });
    
            collector.on('end', collected => {
                // If the collector ends without any interaction
                if (collected.size === 0) {
                    sentMessage.edit({ components: [] }).catch(console.error);
                }
            });
        }).catch(console.error);

        }

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
    });
}

