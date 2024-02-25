// Define the MongoDB client
const { MongoClient, ServerApiVersion } = require('mongodb');

const mdbclient = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Function to add members to the MongoDB database
async function addMembersToDatabase(guild, client) {
    try {
        // Connect to MongoDB
        await client.connect();

        // Access the database
        const database = client.db(process.env.DB_NAME);

        // Access the users collection
        const usersCollection = database.collection('users');

        // Fetch all members of the guild (including offline members)
        const guildMembers = await guild.members.fetch();

        // Iterate through all members of the guild
        for (const member of guildMembers.values()) {
            // Check if the member already exists in the database
            const existingUser = await usersCollection.findOne({ userId: member.user.id, guild: guild.id });

            // If the user doesn't exist in the database, insert them
            if (!existingUser) {
                await usersCollection.insertOne({
                    userId: member.user.id,
                    username: member.user.username,
                    discriminator: member.user.discriminator,
                    guild: guild.id,
                    exp: 0,
                    level: 1,
                    warnings: 0,
                    // Add more fields as needed
                });
            }
        }


        console.log("--------");
        console.log(` GUILD `);
        console.log("--------");
        console.log(`Members of "${guild.name}" are in the database ✅`);

    } catch (err) {
        console.error('Error adding members to MongoDB:', err);
    }
}



// Exporting all the functions
module.exports = {
    run: async function(client) {
        try {
            // Connect to MongoDB
            await mdbclient.connect();
            console.log('Connected to MongoDB ✅');

            // Access the guilds the bot is in
            client.guilds.cache.forEach(async (guild) => {
                // Call a function to add members to the database for each guild
                await addMembersToDatabase(guild, mdbclient);
            });
        } catch (err) {
            console.error('Error connecting to MongoDB:', err);
        }
    }
};
