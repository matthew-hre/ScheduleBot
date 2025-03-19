const schedule = require('node-schedule');
const { Op } = require('sequelize');
const { Event, Registration } = require('../models/database');
const { EmbedBuilder } = require('discord.js');

function setupReminders(client) {
    // Check for upcoming events every minute
    schedule.scheduleJob('* * * * *', async () => {
        try {
            const now = new Date();
            const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

            // Find events starting in the next hour
            const upcomingEvents = await Event.findAll({
                where: {
                    dateTime: {
                        [Op.lte]: oneHourFromNow,
                        [Op.gt]: new Date(now.getTime() - 60 * 1000), // Include events that started in the last minute
                    },
                },
                include: Registration,
            });

            console.log(
                `[${now.toISOString()}] Found ${upcomingEvents.length} upcoming events`,
            );

            for (const event of upcomingEvents) {
                const eventTime = new Date(event.dateTime);
                const timeDiffMinutes = (eventTime - now) / (1000 * 60);

                console.log(`[${now.toISOString()}] Event: ${event.name}`);
                console.log(`Event time: ${eventTime.toISOString()}`);
                console.log(`Time difference in minutes: ${timeDiffMinutes}`);

                // Send reminders if it's approximately 1 hour before the event
                if (timeDiffMinutes >= 59 && timeDiffMinutes <= 61) {
                    console.log(`Sending reminders for event ${event.name}`);
                    for (const registration of event.Registrations) {
                        try {
                            const user = await client.users.fetch(
                                registration.userId,
                            );
                            await user.send(`
                                **Reminder: ${event.name} in 1 hour!**
                                
                                Time: ${eventTime.toLocaleString()}
                                Location: ${event.location}
                                
                                See you there! 
                            `);
                        } catch (error) {
                            console.error(
                                `Failed to send reminder to user ${registration.userId}:`,
                                error,
                            );
                        }
                    }
                }

                // If the event started in the last minute
                if (timeDiffMinutes <= 0 && timeDiffMinutes > -1) {
                    console.log(
                        `Event ${event.name} is starting now! Time diff: ${timeDiffMinutes}`,
                    );
                    try {
                        // Get the original message
                        const channel = await client.channels.fetch(
                            event.channelId,
                        );
                        console.log(`Found channel ${channel.name}`);
                        const message = await channel.messages.fetch(
                            event.messageId,
                        );
                        console.log(`Found original message`);

                        // Create updated embed without the button
                        const embed = EmbedBuilder.from(message.embeds[0]);

                        // Edit the message to remove the button
                        await message.edit({
                            embeds: [embed],
                            components: [], // This removes all components (including the button)
                        });
                        console.log(`Removed button from message`);

                        // Send a message indicating the event has started
                        await channel.send(
                            `**${event.name}** has started! Have fun everyone!`,
                        );
                        console.log(`Sent start message`);
                    } catch (error) {
                        console.error(
                            `Failed to update message for event ${event.id}:`,
                            error,
                        );
                    }
                }
            }
        } catch (error) {
            console.error('Error in reminder scheduler:', error);
        }
    });
}

module.exports = { setupReminders };
