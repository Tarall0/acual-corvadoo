const { MongoClient, ServerApiVersion } = require('mongodb');

const mdbclient = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

module.exports = 
    // Function to add eperience points (XP) to a user in the MongoDB collection
async function addXpToUser(guildId, userId, xp) {
    try {
        // Connect to MongoDB
        await mdbclient.connect();

        // Access the database
        const database = mdbclient.db(process.env.DB_NAME);

        // Access the users collection
        const usersCollection = database.collection('users');

        // Update user document based on userId and guildId
        await usersCollection.updateOne(
            { userId: userId, guild: guildId },
            { $inc: { exp: xp } } // Increment the 'exp' field by the provided 'xp' value
        );

        console.log(`Added ${xp} XP to user ${userId} in guild ${guildId}`);
    } catch (err) {
        console.error('Error updating user in MongoDB:', err);
    } finally {
        // Close the MongoDB connection
        await mdbclient.close();
    }
}
