const { Client, Interaction, MessageEmbed  } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Get Ping of Bot",
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
        .setTitle('Ping title')
        .setURL('https://discord.js.org/')
        .setAuthor('Some ping', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
        .setDescription('Some description here')
        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        .addFields(
          { name: 'Regular ping title', value: 'Some value ping' },
          { name: '\u200B', value: '\u200B' },
          { name: 'Inline field ping', value: 'ping value here', inline: true },
          { name: 'Inline ping title', value: 'Some value ping', inline: true },
        )
        .addField('ping field title', 'Some ping here', true)
        .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .setFooter(`Pong!\nBot Latency: \`${interaction.createdTimestamp}ms\`, Websocket Latency: \`${client.ws.ping}ms\``, 'https://i.imgur.com/AfFp7pu.png');
      
      const mesg = await interaction.reply({ embeds: [msg], fetchReply: true });

    } catch (err) {
      console.log("Something Went Wrong => ", err);
    }
  },
};