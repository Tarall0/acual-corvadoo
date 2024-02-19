const {Client, IntentsBitField} = require('discord.js');
const handleGenericMessage = require('./GenericMessage.js');
const moderation = require('./Moderation.js');
const handleCommannds = require('./HandleCommands.js');
const { levelUser } = require('./db/levelling');
const {run} = require('./db/dbconnection.js');
const express = require('express');
const app = express();
require('dotenv').config();
  
const PORT = process.env.PORT || 3001;

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildMessageReactions,
    ]
})


client.on('ready', () => {
    // Call mongodb connection
    run(client).catch(console.dir);
    console.log(`${client.user.username} is now running ✅`);
});

client.on('messageCreate', async message => {
    // Ignore messages from bots and DMs
    if (message.author.bot || !message.guild) return;

    // Pass user ID, guild ID, and member object to levelUser function
    levelUser(message.author.id, message.guild.id, message.member);
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
