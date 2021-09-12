const { Client, Interaction, MessageEmbed  } = require("discord.js");

module.exports = {
    name: "help",
    description: "Get list of commands",
    type: "CHAT_INPUT",
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    execute: async (client, interaction) => {
        try {
        const msg = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Commandes')
            .setDescription('Liste des commandes')
            .addFields(
            { name: 'PR', value: '*Send URL of a pull request*\n`/pr {application} {type} {link} {description}`' },
            { name: 'Alternant', value: '*get next week alternant infos*\n`/alternant`' },
            { name: 'OUT', value: '*get outs users*\n`/out get {when} {user}`\n*set out a user*\n`/out post {date_start} {date_end} {user}`\n*remove out a user*\n`/out remove {when} {user}`' },
            { name: 'Summon', value: '*Summon someone or role to a channel*\n`/summon {channel} {mentionable}`' },
            )
        
        const mesg = await interaction.reply({ embeds: [msg], fetchReply: true });

        } catch (err) {
        console.log("Something Went Wrong => ", err);
        }
    },
};