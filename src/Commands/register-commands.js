const { REST, Routes, ApplicationCommandManager, ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: 'test',
        description: 'Test command',
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
        name: 'inventory',
        description: 'Check your inventory',

    },
    {
        name: 'emptyinventory',
        description: 'Remove all objects from your inventory',

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
        name: "corvado",
        description: "Get info about Corvado Bot"
    },
    {
        name: "commands_corvado",
        description: "Commands supported by Corvado Bot"
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
