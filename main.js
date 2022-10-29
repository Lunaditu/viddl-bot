const settings = require('./settings.json');
const discord = require('discord.js');
const client = new discord.Client({intents: ['GuildMessageTyping', 'GuildMessages', 'GuildPresences', 'MessageContent', 'Guilds']});
const fs = require('fs');
const vid = require('./vid');
const path = require('path');

client.commands = new discord.Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

client.on('interactionCreate', async (i) => {
    if (!i.isCommand() || i.user.bot || !i.isChatInputCommand()) return;


    const command = i.client.commands.get(i.commandName);
    if (!command) { console.log(`No command matching ${i.commandName} was found.`); return; }

    try {
        await command.execute(i);
    } catch (err) {
        console.log(`Error: ${err}`);
        await i.reply({ content: `There was an error whilst executing this command!`, ephemeral: true });
    }
});

client.once('ready', (c) => {
    console.log(`Logged in as ${c.user.tag}`);

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            client.application.commands.create(command.data);
        } else {
            console.log(`WARNING: The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
});

client.login(settings.token);