const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} = require('discord.js');
const { Event } = require('../models/database');

async function handleScheduleCommand(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('schedule_modal')
        .setTitle('Schedule Event');

    const eventNameInput = new TextInputBuilder()
        .setCustomId('eventName')
        .setLabel('Event Name')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const dateTimeInput = new TextInputBuilder()
        .setCustomId('dateTime')
        .setLabel('Date and Time (YYYY-MM-DD HH:mm)')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const locationInput = new TextInputBuilder()
        .setCustomId('location')
        .setLabel('Location')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const maxAttendeesInput = new TextInputBuilder()
        .setCustomId('maxAttendees')
        .setLabel('Maximum number of attendees')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const descriptionInput = new TextInputBuilder()
        .setCustomId('description')
        .setLabel('Description')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

    const rows = [
        eventNameInput,
        dateTimeInput,
        locationInput,
        maxAttendeesInput,
        descriptionInput,
    ].map((input) => new ActionRowBuilder().addComponents(input));

    modal.addComponents(rows);
    await interaction.showModal(modal);

    try {
        const modalSubmission = await interaction.awaitModalSubmit({
            time: 120000,
            filter: (i) => i.customId === 'schedule_modal',
        });

        const eventData = {
            name: modalSubmission.fields.getTextInputValue('eventName'),
            dateTime: new Date(
                modalSubmission.fields.getTextInputValue('dateTime'),
            ),
            location: modalSubmission.fields.getTextInputValue('location'),
            maxAttendees: parseInt(
                modalSubmission.fields.getTextInputValue('maxAttendees'),
            ),
            description:
                modalSubmission.fields.getTextInputValue('description'),
            creatorId: interaction.user.id,
        };

        const event = await Event.create(eventData);

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(eventData.name).setDescription(`
                📅 **When:** ${eventData.dateTime.toLocaleString()}
                📍 **Where:** ${eventData.location}
                👥 **Capacity:** 0/${eventData.maxAttendees}
                
                ${eventData.description ? `📝 **Description:**\n${eventData.description}` : ''}
                
                **Registered Attendees:**
                *None yet*
            `);

        const registerButton = new ButtonBuilder()
            .setCustomId(`register_${event.id}`)
            .setLabel('Register')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(registerButton);

        const message = await modalSubmission.reply({
            content: `Hey! <@${interaction.user.id}> just scheduled an event!`,
            embeds: [embed],
            components: [row],
            fetchReply: true,
        });

        await event.update({
            messageId: message.id,
            channelId: message.channelId,
        });

        await modalSubmission.followUp({
            content: 'Event created successfully!',
            ephemeral: true,
        });
    } catch (error) {
        console.error('Error creating event:', error);
        if (!interaction.replied) {
            await interaction.reply({
                content:
                    'There was an error creating the event. Please try again.',
                ephemeral: true,
            });
        }
    }
}

module.exports = { handleScheduleCommand };
