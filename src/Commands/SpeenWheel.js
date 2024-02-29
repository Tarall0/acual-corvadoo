const {addXpToUser} = require('../db/utility.js');
const {wheelCommandResponses} = require('../Messages/Responses.js');


const wheelRewards = {
    "You won a cute puppy! 🐕": 150,
    "Congratulations, you get a free coffee! ☕": 100,
    "You landed on a bag of gold coins! 💰": 250,
    "Oh no, better luck next time!": 10,
    "Whoops! Nothing this time.": 10,
    "Nope, that's a flop": 10,
    "Sorry, it's empty this time": 10,
    "You got a candy, its fruity 🍬": 50
};


// Map to store spin counts and last spin time for each user
const spinData = new Map();

function canSpin(userId) {
    const currentTime = new Date().getTime();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    const spinsPerHour = 2;
    const spinsPerDay = 5;

    let userData = spinData.get(userId);

    if (!userData) {
        // If user data doesn't exist, initialize it
        userData = { spinCount: 0, lastSpinTime: 0 };
    }

    // Check if it's been more than an hour since the last spin
    if (currentTime - userData.lastSpinTime >= oneHour) {
        // Reset spin count if it's a new hour
        userData.spinCount = 0;
    }

    if (userData.spinCount < spinsPerHour && userData.spinCount < spinsPerDay) {
        // If user has spins left within the hour and within the day, allow another spin
        userData.spinCount++;
        userData.lastSpinTime = currentTime;
        spinData.set(userId, userData);
        console.log(`${userId} - ${userData.spinCount}`);
        return true;
    } else {
        // User has exceeded either the hourly or daily spin limit
        return false;
    }
}

function spinWheel(i) {
    const rewardsList = Object.keys(wheelRewards);
    const selectedReward = rewardsList[Math.floor(Math.random() * rewardsList.length)];
    const xpWin = wheelRewards[selectedReward];

    const guildId = i.guildId;
    const userId = i.user.id;

    const rannr = Math.floor(Math.random() * wheelCommandResponses.length);
    //respond to the slash command
    i.reply(wheelCommandResponses[rannr]);

    addXpToUser(guildId, userId, xpWin);

    // Send reward message
    setTimeout(() => {
        i.channel.send(`**La ruota gira per ${i.member.displayName}... 🌀**`)
        .then(() => {
            setTimeout(() => {
                i.channel.send(`**${selectedReward}**`)
                    .then(() => {
                        setTimeout(() => {
                            i.channel.send(`*Hai ricevuto ${xpWin} XP*`);
                        }, 500); 
                    });
            }, 2000);
        });
    }, 1000)
 }



module.exports = {canSpin, wheelRewards, spinWheel}