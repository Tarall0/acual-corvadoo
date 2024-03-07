const {Client, IntentsBitField, Partials, GatewayIntentBits} = require('discord.js');
const handleMessages = require('./Messages/HandleMessages.js');
const chatCommands = require('./Messages/ChatCommands.js')
const moderation = require('./Moderation/Moderation.js');
const handleCommannds = require('./Commands/HandleCommands.js');
const emojiReaction = require('./EmojiReaction.js')
const {run} = require('./db/dbconnection.js');
require('dotenv').config();

const client = new Client({
    intents:
        [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildModeration,
            GatewayIntentBits.GuildEmojisAndStickers,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.GuildWebhooks,
            GatewayIntentBits.GuildInvites,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.GuildMessageTyping,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageReactions,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildScheduledEvents,
            GatewayIntentBits.AutoModerationConfiguration,
            GatewayIntentBits.AutoModerationExecution
        ],
    
});


client.once('ready', () => {
    // Call mongodb connection
    run(client).catch(console.dir);
    console.log(`${client.user.username} is now running ✅`);
    emojiReaction(client);
    handleMessages(client);
    chatCommands(client);
    moderation(client);
    handleCommannds(client);
});




client.login(process.env.TOKEN).then(() => {

});
