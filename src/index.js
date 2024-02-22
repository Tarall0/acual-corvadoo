const {Client, IntentsBitField, Partials, GatewayIntentBits} = require('discord.js');
const handleGenericMessage = require('./GenericMessage.js');
const moderation = require('./Moderation.js');
const handleCommannds = require('./HandleCommands.js');
const {run} = require('./db/dbconnection.js');
const express = require('express');
const app = express();
require('dotenv').config();
  
const PORT = process.env.PORT || 3006;

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
});

handleGenericMessage(client);
moderation(client);
handleCommannds(client);

app.get('/', (req, res) => {
    res.send('Corvado Bot server is currently working!');
});
  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



client.login(process.env.TOKEN);
