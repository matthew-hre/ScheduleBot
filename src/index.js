require('dotenv').config();
const {
    Client,
    GatewayIntentBits,
    Partials,
    Events,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} = require('discord.js');
const { registerCommands } = require('./deploy-commands');
const { handleScheduleCommand } = require('./commands/schedule');
const { handleEventRegistration } = require('./commands/register');
const { setupReminders } = require('./utils/reminders');
const { sequelize } = require('./models/database');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel, Partials.Message],
});

client.once(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    await sequelize.sync();
    await registerCommands();
    setupReminders(client);
});

client.on(Events.InteractionCreate, async (interaction) => {
    try {
        if (interaction.isCommand()) {
            if (interaction.commandName === 'schedule') {
                await handleScheduleCommand(interaction);
            }
        } else if (interaction.isButton()) {
            if (interaction.customId.startsWith('register_')) {
                await handleEventRegistration(interaction);
            }
        }
    } catch (error) {
        console.error('Error handling interaction:', error);
        const errorMessage =
            'There was an error processing your request. Please try again later.';
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: errorMessage,
                ephemeral: true,
            });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
