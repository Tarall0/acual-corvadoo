const {Client, IntentsBitField} = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

const roles = [
    {
        id: "1204741044147716127",
        label: "Green Lover 🌿",
    },
    {
        id: "1204741181871759362",
        label: "Gaming Hub 👾",
    },
    {
        id: "1204741418619379722",
        label: "Party Dancer  🎉",
    },
    {
        id: "1204748313027420271",
        label: "Art Fairy 🎨",
    },
    {
        id: "1204747501459214407",
        label: "Tech Gnome 🚀",
    },

]

const shiftroles = [
    {
        id: "1204355299092209716",
        label: "Nightly Warrior",
    },
    {
        id: "1204355135984242730",
        label: "Morning Saviour",
    }
]



client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const { guild, user } = interaction;

    // Find the role corresponding to the button clicked
    const selectedRole = roles.find(role => role.label === interaction.customId) || shiftroles.find(srole => srole.label === interaction.customId);
    if (!selectedRole) return;

    try {
        const member = await guild.members.fetch(user.id);
        const roleToAdd = guild.roles.cache.get(selectedRole.id);
        // ignore console.log( user.id, 'interacted with:', interaction.customId);

        if (member && roleToAdd) {
            if (member.roles.cache.has(roleToAdd.id)) {
                // If the member has the role, remove it
                await member.roles.remove(roleToAdd);
                await interaction.reply({ content: `Role "${selectedRole.label}" has been removed from you.`, ephemeral: true });
            } else {
                // If the member doesn't have the role, add it
                await member.roles.add(roleToAdd);
                await interaction.reply({ content: `Role "${selectedRole.label}" has been added to you.`, ephemeral: true });
            }
        }
    } catch (error) {
        console.error('Error assigning role:', error);
        await interaction.reply({ content: 'An error occurred while assigning the role.', ephemeral: true });
    }
});



client.login(process.env.TOKEN);


exports.modules = {roles, shiftroles}