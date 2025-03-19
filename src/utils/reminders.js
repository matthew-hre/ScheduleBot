const schedule = require('node-schedule');
const { Op } = require('sequelize');
const { Event, Registration } = require('../models/database');

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
                        [Op.between]: [now, oneHourFromNow],
                    },
                },
                include: Registration,
            });

            for (const event of upcomingEvents) {
                // Calculate minutes until event
                const minutesUntil = Math.floor(
                    (event.dateTime - now) / (1000 * 60),
                );

                // Send reminders if it's approximately 1 hour before the event
                if (minutesUntil >= 59 && minutesUntil <= 61) {
                    for (const registration of event.Registrations) {
                        try {
                            const user = await client.users.fetch(
                                registration.userId,
                            );
                            await user.send(`
                                🎬 **Reminder: Movie Night in 1 hour!**
                                
                                Event: ${event.name}
                                Time: ${event.dateTime.toLocaleString()}
                                Location: ${event.location}
                                
                                See you there! 🍿
                            `);
                        } catch (error) {
                            console.error(
                                `Failed to send reminder to user ${registration.userId}:`,
                                error,
                            );
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error processing reminders:', error);
        }
    });
}

module.exports = { setupReminders };
