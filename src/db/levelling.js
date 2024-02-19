const { MongoClient, ServerApiVersion } = require('mongodb');

const mongoClient = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const levelRoles = {
    5: "1142772431027699754",
    10: "1142774781586972684",
    15: "1142774872674676838",
    20: "1142774984217993266"
    // Add more level roles as needed
};

async function levelUser(userId, guildId, member) {
    try {
        await mongoClient.connect();
        const database = mongoClient.db(process.env.DB_NAME);
        const usersCollection = database.collection('users');

        // Find or create user in the database
        let user = await usersCollection.findOneAndUpdate(
            { userId: userId, guild: guildId },
            { $setOnInsert: { userId: userId, exp: 0, level: 1 } },
            { upsert: true, returnDocument: 'after' }
        );

        // Check for level up
        const xpRequiredForUp = calculateXpToNextLevel(user.level);
        
        if (user.experience >= xpRequiredForUp) {

            // Calculate new level
            const newLevel = Math.floor(user.experience / 1000) + 1;

            // Update user's level
            await usersCollection.updateOne({ userId: userId }, { $set: { level: newLevel } });

            console.log(`${userId} has reached lvl ${newLevel}`);

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
    } finally {
        await mongoClient.close();
    }
}


function calculateXpToNextLevel(currentLevel) {
    // Assuming a linear progression where each level requires 1000 more XP than the previous level
    return currentLevel * 1000;
}

module.exports = { levelUser };
