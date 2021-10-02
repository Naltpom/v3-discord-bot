const { Client, Interaction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const db = require('../../../config/db.config');
const Get = require('../../sequelize/get');

module.exports = {
  name: "alternant",
  description: "get next week alternant infos",
  type: "CHAT_INPUT",
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  execute: async (client, interaction) => {
    try {
        let roleId = await Get.item(db.Role, {where: {slug: 'alternant', guild: interaction.guild.id}}).then(i => {return i.dataValues._id ?? ''}).catch(e => e)

        // collect all alternant [userId => nickname]
        let users = await db.User.findAll(
            {
                attributes: [
                    '_id',
                    'nickname'
                ],
                where: {
                    role: { alternant: roleId.toString() },
                    guild: interaction.guild.id
                }
            }
        ).then(usersList => {
            let ids = [];
            usersList.map(i => ids.push({id: i._id, nickname: i.nickname}))
            return ids
        })
        
        // define next week monday date
        const days =[1,7,6,5,4,3,2];
        const d = new Date();
        d.setDate(d.getDate()+days[d.getDay()]);
        let date = [d.getDate(), d.getMonth(), d.getFullYear()].join('/');
        

        const components = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('alternant-valid')
                    .setLabel('VALIDER')
                    .setStyle('SUCCESS')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('alternant-delete')
                    .setLabel('REFUSER')
                    .setStyle('DANGER')
            )

        const embed = new MessageEmbed()
            .setTitle('Alternant')
            .setDescription(`Pour la semaine du ${date} les ${users.length} Alternant(s) :`)
            .setFields({ name: 'reste', value: `${users.length}`})
        let mesg = await interaction.reply({ embeds: [embed], fetchReply: true }).then(i => {
            users.forEach(async user => {
                // embed.addFields({ name: user.nickname, value: user.id })
                const components = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`alternant-yes-${user.id}`)
                            .setLabel('Oui')
                            .setStyle('SUCCESS')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId(`alternant-non-${user.id}`)
                            .setLabel('Non')
                            .setStyle('DANGER')
                    )
                mesg = await interaction.followUp({ content: user.nickname, components: [components], fetchReply: true  });
            });
        });


    } catch (err) {
      console.log("Something Went Wrong => ", err);
    }
  },
};