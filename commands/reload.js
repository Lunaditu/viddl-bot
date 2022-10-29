const { SlashCommandBuilder } = require("discord.js");
const path = require('path');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription("Reloads all commands (bot admin only)"),
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute (interaction) {
        if (interaction.member.id != "265784515710943232") return await interaction.reply({ephemeral: true, content: "You are not permitted to use this command!"});
        
        const commandsPath = __dirname;
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

        await interaction.deferReply({ephemeral:true});

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            delete require.cache[require.resolve(filePath)]
            const command = require(filePath);
            if (command.data.name == this.data.name) break;
            if ('data' in command && 'execute' in command) {
                let oldCommand = interaction.client.application.commands.cache.find(x => x.name == command.data.name);
                interaction.client.commands.set(command.data.name, command);
                interaction.client.application.commands.edit(oldCommand, command.data);
            } else {
                console.log(`WARNING: The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
        await interaction.editReply({ephemeral: true, content: "Reloaded successfully!"});
    },
};