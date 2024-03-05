const { MongoClient, ServerApiVersion } = require('mongodb');
const {mdbclient} = require('./dbconnection')

module.exports = {
    // Function to add eperience points (XP) to a user in the MongoDB collection
addXpToUser: async function addXpToUser(guildId, userId, xp) {
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
    }
},

getUserInfo: async function getUserInfo(guildId, userId){
    try {
        // Connect to MongoDB
        await mdbclient.connect();

        // Access the database
        const database = mdbclient.db(process.env.DB_NAME);

        // Access the users collection
        const usersCollection = database.collection('users');

        // Find the user information based on guildId and userId
        const userInfo = await usersCollection.findOne({ guild: guildId, userId });

        if (userInfo) {
            console.log(`User Info for ${userInfo.username}#${userInfo.discriminator} (ID: ${userInfo.userId}) in guild ${userInfo.guild}:`);
        } else {
            console.log(`User information not found for guild ${guildId} and user ${userId}`);
        }

        return userInfo; // Return the user information
    } catch (err) {
        console.error('Error retrieving user information from MongoDB:', err);
        throw err; // Throw the error for handling in the caller
    }
},

setPokemon: async function setPokemon(guildId, userId, pokemon){
    try {
        // Connect to MongoDB
        await mdbclient.connect();

        // Access the database
        const database = mdbclient.db(process.env.DB_NAME);

        // Access the users collection
        const usersCollection = database.collection('users');

        // Find the user information based on guildId and userId
        const userInfo = await usersCollection.findOne({ guild: guildId, userId });

        // Update user document based on userId and guildId
        await usersCollection.updateOne(
            { userId: userId, guild: guildId },
            { $set: { guildpokemon: pokemon } }
        );
        
    } catch (err) {
        console.error('Error adding Pokemon to user in db', err);
        throw err; // Throw the error for handling in the caller
    }
},

setObject: async function setObject(guildId, userId, object){
    return new Promise(async (resolve, reject) => {
        try {
            // Connect to MongoDB
            await mdbclient.connect();

            // Access the database
            const database = mdbclient.db(process.env.DB_NAME);

            // Access the users collection
            const usersCollection = database.collection('users');

            // Find the user information based on guildId and userId
            const userInfo = await usersCollection.findOne({ guild: guildId, userId });

            // Check if user has less than 6 objects
            if(userInfo.objects.length < 6) {
                // Update user document based on userId and guildId if user has less than 6 objects 
                await usersCollection.updateOne(
                    { userId: userId, guild: guildId },
                    { $push: { objects: { $each: [object], $position: 0 } } } // Add object to the first position of the objects array
                );
                resolve(); // Resolve the promise if the object is successfully added
            } else {
                reject(new Error("User already has maximum number of objects."));
            }
        } catch (err) {
            console.error('Error adding object to user in db', err);
            reject(err); // Reject the promise with the error for handling in the caller
        }
    });
},

emptyUserInventory: async function emptyUserInventory(guildId, userId) {
    try {
        await mdbclient.connect();
        const database = mdbclient.db(process.env.DB_NAME);
        const usersCollection = database.collection('users');
        
        await usersCollection.updateOne(
           { userId: userId, guild: guildId },
           { $set: { objects: [] } }
           
        );

        console.log(`Inventory emptied for user ${userId} in guild ${guildId}.`);
    } catch (error) {
        console.error('Error emptying inventory:', error);
    }
},

addGuildCoin: async function addGuildCoin(guildId, userId){
    try {
        await mdbclient.connect();
        const database = mdbclient.db(process.env.DB_NAME);
        const usersCollection = database.collection('users');
        
        await usersCollection.updateOne(
           { userId: userId, guild: guildId },
           { $inc: { gold: + 1 } }
        );

        console.log(`1 Guild Coin added for user ${userId} in guild ${guildId}.`);
    } catch (error) {
        console.error('Error adding coin:', error);
    }
},

addFightWin: async function addFightWin(guildId, userId){
    try {
        await mdbclient.connect();
        const database = mdbclient.db(process.env.DB_NAME);
        const usersCollection = database.collection('users');
        
        await usersCollection.updateOne(
           { userId: userId, guild: guildId },
           { $inc: { f_wins: + 1 } }
        );

        console.log(`1 f_win registered for user ${userId} in guild ${guildId}.`);
    } catch (error) {
        console.error('Error registered f_win:', error);
    }
}

}