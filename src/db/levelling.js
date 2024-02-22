const { MongoClient, ServerApiVersion } = require('mongodb');
const {EmbedBuilder} = require('discord.js');

const mdbclient = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const levelRoles = {
    5: "1208148998012010546",
    10: "1142774781586972684",
    15: "1142774872674676838",
    20: "1142774984217993266"
    // Add more level roles as needed
};

module.exports = async function levelUser(userId, guildId, member) {
    try {
        await mdbclient.connect();
        const database = mdbclient.db(process.env.DB_NAME);
        const usersCollection = database.collection('users');

        // Find or create user in the database
        let user = await usersCollection.findOneAndUpdate(
            { userId: userId, guild: guildId },
            { $setOnInsert: { 
                userId: userId,
                username: member.user.username,
                discriminator: member.user.discriminator,
                guild: guildId,
                exp: 0,
                level: 1,
                warnings: 0, 
            } },
            { upsert: true, returnDocument: 'after' }
        );

        console.log(user.userId);

        // Check for level up
        const xpRequiredForUp = calculateXpToNextLevel(user.level);
        console.log("current XP:"+ user.exp+" // XP required" + xpRequiredForUp + " // currentlvl" + user.level);
        
        if (user.exp >= xpRequiredForUp) {

            // Calculate new level
            const newLevel = Math.floor(user.exp / 1000) + 1;

            try {
                await usersCollection.updateOne(
                    { userId: userId, guild: guildId }, 
                    { $set: { level: newLevel, exp: 0 } } // Resetting exp to 0 after leveling up
                );

                console.log(`${userId} has reached lvl ${newLevel}`);


            } catch(e) {
                console.log(e);
            }

            // Get the default channel of the guild
            const defaultChannel = member.guild.channels.cache.find(channel => channel.name === 'lounge');
            // Send a message to the default channel
            if (defaultChannel) {
                const embed = new EmbedBuilder()
                    .setTitle('⭐ Level Up')
                    .setDescription(`${member.displayName} ha raggiunto il livello ${newLevel}! 🎉`)
                    .setColor('#00ff00');
                defaultChannel.send({embeds : [embed]});
            } else {
                console.log('Unable to find a suitable channel to send the message.');
                console.log('Guild channels:');
                console.log(member.guild.channels.cache.map(channel => `${channel.name} (${channel.type})`));
            }

            // Check and assign new role
            if (levelRoles[newLevel]) {
                const roleId = levelRoles[newLevel];
                const role = member.guild.roles.cache.get(roleId);
                if (role) {
                    await member.roles.add(role);
                }
            }

            // Remove old role
            const oldLevel = newLevel - 5;
            if (oldLevel > 0 && levelRoles[oldLevel]) {
                const oldRoleId = levelRoles[oldLevel];
                const oldRole = member.guild.roles.cache.get(oldRoleId);
                if (oldRole) {
                    await member.roles.remove(oldRole);
                }
            }

        }
    } catch (error) {
        console.error('Error in levelUser:', error);
    } 
}


function calculateXpToNextLevel(currentLevel) {
    // Assuming a linear progression where each level requires 1000 more XP than the previous level
    return currentLevel * 1000;
}


