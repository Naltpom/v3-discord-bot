const { Client, Interaction } = require("discord.js");

module.exports = {
    name: 'summon',
    description: 'Summon someone or role to a channel',
    roles: [
        {
            type: 2,
            permission: true
        }
    ],
    options: [
        {
            name: 'channel',
            description: 'get the channel to send invite to',
            required: true,
            type: 7,
        },
        {
            name: 'mentionable',
            description: 'Includes users and roles',
            required: false,
            type: 9,
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
        
        // get options
        let channel, mentionable;
        for (let option in options) {
            switch (options[option].name) {
                case 'mentionable':
                    mentionable = options[option];
                    break;
                case 'channel':
                    channel = options[option];
                    break;
                default:
                    break;
            }
        }

        // get create message
        let mentionableMsg = '';
        if (mentionable !== undefined && mentionable.user !== undefined) {
            mentionableMsg = `<@${mentionable.user.id}>,`
        } else if (mentionable !== undefined && mentionable.role !== undefined) {
            mentionableMsg = `<@&${mentionable.role.id}>,`
        }
        let mesg = `${mentionableMsg} Vous êtes attendu dans le channel \`${channel.channel.name}\` !`
        
        // get channel, then collect all invitation of the channel, then collect the last code created
        const channelSummon = await guild.channels.fetch(channel.channel.id)
        let validCode = await channelSummon.fetchInvites(i => i)
        validCode = validCode.map(i => i.code)
        validCode = validCode[validCode.length - 1]
        
        // if no code is set, then create a new one
        const codeInvite = (validCode !== undefined) ? validCode : await channelSummon.createInvite({
            reason: 'le Summon a commencais',
            maxAge: 900 // set code valid 15 minutes
        }).then(e => e.code)

        // add invite link to the message
        mesg += `\nhttps://discord.gg/${codeInvite}`

        // send reply message
        await interaction.reply(mesg);

    } catch (err) {
      console.log("Something Went Wrong => ", err);
    }
  },
};