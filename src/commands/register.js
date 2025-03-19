const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const { Event, Registration } = require('../models/database');

async function handleEventRegistration(interaction) {
    const EventId = interaction.customId.split('_')[1];

    try {
        const event = await Event.findByPk(EventId, {
            include: Registration,
        });

        if (!event) {
            return await interaction.reply({
                content: 'This event no longer exists.',
                ephemeral: true,
            });
        }

        // Check if user is already registered
        const existingRegistration = await Registration.findOne({
            where: {
                EventId: event.id,
                userId: interaction.user.id,
            },
        });

        if (existingRegistration) {
            return await interaction.reply({
                content: 'You are already registered for this event!',
                ephemeral: true,
            });
        }

        // Check if event is full
        if (event.Registrations.length >= event.maxAttendees) {
            return await interaction.reply({
                content: 'Sorry, this event is already full!',
                ephemeral: true,
            });
        }

        // Register the user
        await Registration.create({
            EventId: event.id,
            userId: interaction.user.id,
        });

        // Send DM confirmation
        try {
            await interaction.user.send(
                `You have been registered for "${event.name}" on ${event.dateTime.toLocaleString()}!`,
            );
        } catch (error) {
            console.error('Could not send DM to user:', error);
        }

        // Update the event message
        const registrations = await Registration.findAll({
            where: { EventId: event.id },
        });

        const embed = new EmbedBuilder().setColor(0x0099ff).setTitle(event.name)
            .setDescription(`
                📅 **When:** ${event.dateTime.toLocaleString()}
                📍 **Where:** ${event.location}
                👥 **Capacity:** ${registrations.length}/${event.maxAttendees}
                
                ${event.description ? `📝 **Description:**\n${event.description}` : ''}
                
                **Registered Attendees:**
                ${registrations.map((reg) => `<@${reg.userId}>`).join('\n')}
            `);

        const components = [];
        if (registrations.length < event.maxAttendees) {
            const registerButton = new ButtonBuilder()
                .setCustomId(`register_${event.id}`)
                .setLabel('Register')
                .setStyle(ButtonStyle.Primary);
            components.push(
                new ActionRowBuilder().addComponents(registerButton),
            );
        }

        await interaction.message.edit({
            embeds: [embed],
            components,
        });

        await interaction.reply({
            content: 'You have been successfully registered for the event!',
            ephemeral: true,
        });
    } catch (error) {
        console.error('Error handling registration:', error);
        await interaction.reply({
            content:
                'There was an error processing your registration. Please try again.',
            ephemeral: true,
        });
    }
}

module.exports = { handleEventRegistration };
