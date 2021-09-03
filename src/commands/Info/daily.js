const { Client, Interaction, MessageEmbed  } = require("discord.js");

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
        let userId, roleId;



        for (let option in options) {
            switch (options[option].name) {
                case 'user':
                    userId = options[option].value;
                    break;
                case 'role':
                    roleId = options[option].value;
                    break;
                default:
                    break;
            }
        }
      const mesg = await interaction.reply(`@${userId}, @&${roleId}`);

    } catch (err) {
      console.log("Something Went Wrong => ", err);
    }
  },
};