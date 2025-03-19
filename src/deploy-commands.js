const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('schedule')
        .setDescription('Schedule a new movie night event'),
];

async function registerCommands() {
    try {
        const rest = new REST().setToken(process.env.DISCORD_TOKEN);
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: commands,
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

module.exports = { registerCommands };
