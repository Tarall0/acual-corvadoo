const { REST, Routes, ApplicationCommandManager, ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: 'test',
        description: 'Test command',
    },
    {
        name: 'add',
        description: 'Add two numbers',
        options: [
            {
                name: 'number1', 
                description: 'Add the first number',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
            {
                name: 'number2', 
                description: 'Add the second number',
                type: ApplicationCommandOptionType.Number,
                required: true,
            }
        ]
    },
    {

        name: 'insult',
        description: 'Generate a random insult for the user you want',
        options:[
            {
                name: 'username',
                description: 'Name of the user you want to insult lol',
                type: ApplicationCommandOptionType.String,
                required: true,
            }

        ]
    },
    {
        name: 'randommeme',
        description: 'Generate a random meme',
    },
    {

        name: 'spinwheel',
        description: 'Spin the weel of fortune to earn a reward',
    },
    {
        name: 'cryptoinfo',
        description: 'Show current info of cryptocurrencies',
        options: [
            {
                name: 'cryptoname',
                description: "The name of the currency",
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]

    },
    {
        name: 'profileinfo',
        description: 'Check user info in the server',

    },
    {
        name: 'poll',
        description: 'Simple emoji powered poll',
        options: [
            {
                name: 'question',
                description: 'Here goes the query you want to make the poll for',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'option1',
                description: 'First option',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'emoji1',
                description: "First option's emoji",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'option2',
                description: 'First option',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'emoji2',
                description: "First option's emoji",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'duration',
                description: 'Duration of the poll in seconds',
                type: ApplicationCommandOptionType.Integer,
                required: false,
            }
        ]
    },
    {
        name: 'permapoll',
        description: 'Simple emoji powered poll - permanent',
        options: [
            {
                name: 'question',
                description: 'Here goes the query you want to make the poll for',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'option1',
                description: 'First option',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'emoji1',
                description: "First option's emoji",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'option2',
                description: 'First option',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'emoji2',
                description: "First option's emoji",
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
    {
        name: "about",
        description: "About Corvado Bot"
    },
    {
        name: "corvado",
        description: "Commands supported by Corvado Bot"
    },
    {
        name: 'review',
        description: 'Send feedback for Corvado Bot',
        options: [
            {
                name: 'stars',
                description: 'Add a star value from 1 to 5',
                type: ApplicationCommandOptionType.Number,
                choices: [
                    {
                        name: "⭐",
                        value: 1,
                    },
                    {
                        name: "⭐ ⭐",
                        value: 2,
                    },
                    {
                        name: "⭐ ⭐ ⭐",
                        value: 3,
                    },
                    {
                        name: "⭐ ⭐ ⭐ ⭐",
                        value: 4,
                    },
                    {
                        name: "⭐ ⭐ ⭐ ⭐ ⭐",
                        value: 5,
                    },
                ],
                required: true,
            },
            {
                name: 'feedback',
                description: 'Tell us what you think about Corvado Bot',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    }
]

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    console.log("Indexing bot slash commands")
    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        )
        console.log("Successfully registered commands!");
    } catch (error) {
        console.log(`An error occurred! ${error}`);
    }
})();
