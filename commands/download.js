const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { downloadVid } = require("../vid");
const instagramGetUrl = require('instagram-url-direct');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('download')
    .setDescription("Download a video using youtube-dl.")
    .addStringOption(
        (option) => option.setName('url')
        .setDescription('URL of the video pretty please')
        .setRequired(true)
        )
    .addNumberOption(
        (option) => option.setName('platform')
        .setDescription('Specify the platform.')
        .addChoices({ name: 'General', value: 0})
        .addChoices({ name: 'Instagram Post (Use when General is not working for your link.)', value: 1 })
        .setMinValue(0).setMaxValue(1)
        .setRequired(true)
        ),
    async execute (i) {
        let url = i.options.getString('url');
        let platform = i.options.getNumber('platform');
        if (platform == 1) {
            let links = await instagramGetUrl(url);
            url = links.url_list[0];
        }
        
        await i.reply({content: `Downloading... Please wait.${platform == 1 ? ' Note that Instagram videos take more time to download due to their servers.':''}`, ephemeral: false});

        downloadVid(url, async (path, name) => {
            await i.editReply({content: "Uploading... Please wait further more."});
            let att = new AttachmentBuilder(path, {name: name});
            return await i.editReply({files:[att]}).then(async () => {
                await i.editReply({content: `Your video is ready!`});
                return true;
            }).catch(async (reason) => {
                await i.editReply({content: `Video could not be uploaded due to error: ${reason}`});
                return true;
            });
        }).catch(async (reason) => {
            await i.editReply({content: `Video could not be downloaded due to error: ${reason}`});
        });
    },
};