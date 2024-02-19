const {roles, shiftroles} = require('./assign-roles.js');
const addXpToUser = require('./db/utility.js');

const greetings = [
    "Hi", "Hello!", "How are you?", "Hi there!", "Hey :)", "Yo!", "Here I am", "What?",
];

const underDev = [
    "I am not currently developed for searches. You can ask Google for it.", 
    "I am not able to do that", 
    "Sorry, I am not implemented to do that", 
    "I cannot currently do that. Ask the developer to add me that feature", 
    "I am currently not able to proceed with your request"
]




module.exports = function(client) {
    client.on('messageCreate', async (msg) => {

    const caseInsensitiveContent = msg.content.toLowerCase();
    const guildId = msg.guild.id;
    const userId = msg.author.id;

    if(caseInsensitiveContent.includes("corvado")){
        const rand = Math.floor(Math.random() * greetings.length);
        
        const xpToAdd = 5;

        msg.reply(greetings[rand]);
        addXpToUser(guildId, userId, xpToAdd);

    }


    if(caseInsensitiveContent.includes("corvado search")){
        underDevelopement(msg);
    }

    if((caseInsensitiveContent.includes("corvado can you")) || (caseInsensitiveContent.includes("corvado could you")) || (caseInsensitiveContent.includes("corvado would you"))){
        underDevelopement(msg);
    }

    if(caseInsensitiveContent.includes("corvado what is") || caseInsensitiveContent.includes("corvado what kind") || caseInsensitiveContent.includes("corvado what should")){
        underDevelopement(msg);
    }

    /** Random switch  */
    const x_xpToAdd = 5;

    switch(caseInsensitiveContent){
        case 'patty':
            const rand = Math.floor(Math.random() * 2);

            if (rand) {
                msg.reply('?!');
            } else {
                msg.reply('salvatò');
                msg.react("🌶️");
            }
            
            addXpToUser(guildId, userId, x_xpToAdd);
            break;
        case 'strike':

            const srand = Math.floor(Math.random() * 3);

            const gifUrls = ['https://tenor.com/view/thor-avenger-chris-hemsworth-mjolnir-gif-13624915'];

            msg.reply('STRIKE ' + gifUrls[0]);
            msg.react("👊");

            addXpToUser(guildId, userId, x_xpToAdd);
            break;

        case 'cucu':
            msg.reply("rucu");
            msg.react("🦚");
            msg.react("🦜");
            addXpToUser(guildId, userId, x_xpToAdd);
            break;
        case 'signoraa':
            msg.reply("I limoniii");
            msg.react("🍋")
            addXpToUser(guildId, userId, x_xpToAdd);
            break;
    }

    

    /** ! Commands (Unofficial commands available) */

    if (msg.content.startsWith('!assign-roles')) {
        const components = roles.map(role => ({
            type: 1,
            components: [
                {
                    type: 2,
                    style: 2,
                    label: role.label,
                    customId: role.label
                }
            ]
        }));
    
        msg.reply({ content: '**Lables**: choose the lable(s) that you want', components });
    }
    
    if (msg.content.startsWith('!shift-roles')) {
        const components = shiftroles.map(srole => ({
            type: 1,
            components: [
                {
                    type: 2,
                    style: 2,
                    label: srole.label,
                    customId: srole.label
                }
            ]
        }));
    
        msg.reply({ content: '**Shifts**: choose the shift-hour you are currently doing', components });
    }

    if(msg.content.startsWith("!bestemmia") && (msg.channel.id == '1204381121991934032')){
        const dio = [
            "Dio",
            "Madonna",
            "Maometto",
            "Jehovah",
            "iddio",
            "dio",
            "Allah",
        ];
        
        const agg = [
            "ladro",
            "cane",
            "ornitorinco",
            "colorato",
            "imbalsamato",
            "nosferatu",
            "incalanatore di insulti",
            "inchiodato",
            "vandalo",
            "porco",
            "Onlyfanser che manda i santini porno a tutti i santi del paradiso."
        ]

        const randio = dio[Math.floor(Math.random() * dio.length)];
        const randagg = agg[Math.floor(Math.random() * agg.length)];

        msg.reply(`${randio} ${randagg}`)
    }
    
    
} )
}

function underDevelopement(msg){
    const rand = Math.floor(Math.random() * underDev.length);
    msg.reply(underDev[rand]);
}