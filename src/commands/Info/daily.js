const { Client, Interaction, MessageEmbed  } = require("discord.js");
const Get = require('../../sequelize/get')
const db = require('../../../config/db.config')

module.exports = {
    name: 'daily',
    description: 'Send URL of a pull request',
    roles: [
        {
            // id: getId('tech'),
            type: 2,
            permission: true
        }
    ],
    options: [
        {
            name: 'user',
            description: 'call a specific user',
            require: false,
            type: 6,
        },
        {
            name: 'role',
            description: 'call a specific grp',
            require: false,
            type: 8,
        }
    ],
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  execute: async (client, interaction) => {
    try {  
        const options = interaction.options._hoistedOptions;
        const guild = interaction.guild;  

        // collect default role to ping if not parameters set
        const defaultRoleId = await Get.item(db.Role, {where: {slug: 'tech', guild: guild.id}}).then(i => i._id);
        
        // create message
        let mesg = (options.length !== 0) ? '' : `<@&${defaultRoleId}>`;
        for (let option in options) {
            switch (options[option].name) {
                case 'user':
                    mesg += `<@${options[option].value}> `;
                    break;
                case 'role':
                    mesg += `<@&${options[option].value}> `;
                    break;
                default:
                    break;
            }
        }

        mesg += `\nVous êtes attendu dans le channel \`Daily\` pour le daily !`
        
        // collect the voice channel to send the daily users
        const dbChannel = await Get.item(db.Channel, {where: {slug: 'daily', guild: interaction.guild.id}}).then(i => i === null ? null : i._id)

        // if channel exist
        if (null !== dbChannel) {
            // get channel, then collect all invitation of the channel, then collect the last code created
            const channelDaily = await guild.channels.fetch(dbChannel)
            let validCode = await channelDaily.fetchInvites(i => i)
            validCode = validCode.map(i => i.code)
            validCode = validCode[validCode.length - 1]
            
            // if no code is set, then create a new one
            const codeInvite = (validCode !== undefined) ? validCode : await channelDaily.createInvite({
                reason: 'le daily a commencais',
                maxAge: 900 // set code valid 15 minutes
            }).then(e => e.code)
            mesg += `\nhttps://discord.gg/${codeInvite}`
        }

        await interaction.reply(mesg);

    } catch (err) {
      console.log("Something Went Wrong => ", err);
    }
  },
};