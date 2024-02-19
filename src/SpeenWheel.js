const addXpToUser = require('./db/utility.js');

const wheelRewards = {
    "You won a cute puppy! 🐕": 100,
    "Congratulations, you get a free coffee! ☕": 50,
    "You landed on a bag of gold coins! 💰": 200,
    "Oh no, better luck next time!": 10,
    "Whoops! Nothing this time.": 10,
    "Nope, that's a flop": 10,
    "Sorry, it's empty this time": 10,
    "You got a candy, its fruity 🍬": 20
};

const wheelcommandresponses = [
    "Sure! :purple_heart:",
    "*Just one moment :)*",
    "*Here we go! :arrows_counterclockwise:*"
]


// Map to store daily spin count for each user
const dailySpinCounts = new Map();

function canSpin(userId) {
    const spinCount = dailySpinCounts.get(userId) || 0;
    // Limit each user to 3 spins per day
    const spinsPerDay = 3;

    if (spinCount < spinsPerDay) {
        dailySpinCounts.set(userId, spinCount + 1);
        console.log(`${userId} - ${spinCount}`);
        return true;
    } 
    return false;
}

function spinWheel(i) {
    const rewardsList = Object.keys(wheelRewards);
    const selectedReward = rewardsList[Math.floor(Math.random() * rewardsList.length)];
    const xpWin = wheelRewards[selectedReward];

    const guildId = i.guildId;
    const userId = i.user.id;

    const rannr = Math.floor(Math.random() * wheelcommandresponses.length);
    //respond to the slash command
    i.reply(wheelcommandresponses[rannr]);

    addXpToUser(guildId, userId, xpWin);

    // Send reward message
    i.channel.send(`**The wheel is spinning for ${i.member.displayName}... 🌀**`)
    .then(() => {
        setTimeout(() => {
            i.channel.send(`**${selectedReward}**`)
                .then(() => {
                    setTimeout(() => {
                        i.channel.send(`You just received ${xpWin} XP`);
                    }, 500); 
                });
        }, 2000);
    });
 }



module.exports = {canSpin, wheelRewards, spinWheel}