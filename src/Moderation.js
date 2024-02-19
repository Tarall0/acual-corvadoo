const bannedwords = ["Dio can", "diocan", "dio can", "porcodio", "dio cane", "diocane", "cristo infame", "porcoddio", "dio infame", "porvocdio", "porc@ di@", "porco dio"];
const workwords = ["HR", "hr", "host", "dss", "R2", "NPS", "CLS", "detractor", "chromebox", "guest", "QA", "TL", "team leader", "TC", "Team coordinator", "OM","operation manager", "frattini", "phrattiny", "fratini", "vincent", "atrium", "debora", "deborah", "foundever", "sitel"]; 
const whitewords = [""]; // to implement a word whitelisting system where certain words are allowed even if they match the banned word pattern to reduces false positive intervention

const responses = [
    "Bro basta parlare di lavoro! 🎉",
    "We chill here, no work discussion ✨",
    "Ti invito a rilassarti e non pensare al lavoro 😎",
]

module.exports = function(client) {
    client.on('messageCreate', async (msg) => {
        // to implement a further handling logic for the moderatio 

        const caseInsensitiveContent = msg.content.toLowerCase();

        if (msg.author.bot) return;

        // Check if the message contains any banned words
        const containsBannedWord = bannedwords.some(word => caseInsensitiveContent.includes(word.toLowerCase()));

        // Check if message contains "work words"
        const containsExactWorkWords = workwords.some(work => {
            const regex = new RegExp("\\b" + work.toLowerCase() + "\\b");
            return regex.test(msg.content.toLowerCase());
        });

        if (containsExactWorkWords) {
            const randresponse = responses[Math.floor(Math.random() * responses.length)];
            msg.reply(randresponse);
        }

        if (containsBannedWord && (msg.channel.id !== '1204381121991934032')) {
            let censoreduser = msg.author.username;
            msg.channel.send("I just removed " + censoreduser + "'s message as it is not appropriate for this channel.");
            msg.delete();
            // msg.author.send() ?
        }
    })
}
