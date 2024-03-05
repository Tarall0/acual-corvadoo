const {addXpToUser} = require('../db/utility.js');

module.exports = function(client){

    client.on('messageReactionAdd', async (reaction, user) => {

        const guildId = reaction.message.guild.id; 
        const userId = user.id;
        const xpWin = 5;

        // Check if the reaction is on a message and not by the bot itself
        if (reaction.message.author.bot) return;

        console.log(`Adding ${xpWin} to ${user.username}`)

        // Add XP to the user
        addXpToUser(guildId, userId, xpWin);
        
    });
}
