# Discord Event Scheduler Bot

A Discord bot for scheduling and managing events within your server. Features automatic reminders, registration management, and capacity controls.

## Features

- Schedule events with details like date, time, location, and capacity
- Easy registration system with a simple button click
- Automatic event announcements
- Capacity management
- Automated reminders one hour before events
- Direct message notifications for registrations and reminders

## Setup

### 1. Create Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and name your bot
3. Go to the "Bot" section and click "Add Bot"
4. Click "Reset Token" to reveal your bot token
5. Save the token for later use

### 2. Configure Bot Settings

In the Discord Developer Portal, under the "Bot" section:

1. Enable these Gateway Intents:

    - Server Members Intent
    - Message Content Intent
    - Server Message Intent
    - Direct Message Intent

2. Get your Client ID:
    - Go to "General Information"
    - Copy your "Application ID" (this is your Client ID)

### 3. Bot Permissions

The bot requires these permissions:

- Send Messages
- Embed Links
- Read Message History
- Use External Emojis
- Add Reactions
- View Channels
- Send Messages in Threads

### 4. Installation

1. Clone this repository
2. Install dependencies:
    ```bash
    npm install
    ```
3. Copy `.env.example` to `.env` and fill in your details:
    ```
    DISCORD_TOKEN=your_bot_token_here
    CLIENT_ID=your_client_id_here
    ```

### 5. Add Bot to Server

1. Generate an invite link:
    - Go to OAuth2 → URL Generator in the Developer Portal
    - Select scopes: `bot` and `applications.commands`
    - Select the permissions listed in section 3
    - Copy the generated URL
2. Open the URL in a browser
3. Select your server and click "Authorize"

### 6. Start the Bot

```bash
npm start
```

## Usage

- `/schedule` - Opens a modal to create a new event
    - Enter event name
    - Set date and time
    - Specify location
    - Set maximum attendees
    - Add optional description

## Development

To run the bot in development mode with auto-reload:

```bash
npm run dev
```

## Database

The bot uses SQLite for data storage. The database file (`database.sqlite`) will be created automatically when you first run the bot.

## Troubleshooting

If you encounter issues:

1. Ensure all required intents are enabled in the Discord Developer Portal
2. Verify the bot has all required permissions in your server
3. Check that your `.env` file contains the correct token and client ID
4. Make sure the bot's role in your server is high enough to send messages and create embeds
