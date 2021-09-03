const { Client, Interaction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Get = require("../../sequelize/get");
require('dotenv-flow').config({silent: true});
const env = process.env;
const DateFormater = require('../../utils/dateFormat');

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */

module.exports = async (client, interaction) => {
  const guild = client.guilds.cache.get(env.SERVER);           

  try {
    if (interaction.isCommand()) {
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd) return interaction.reply({content: "Something Went Wrong"});

      cmd.execute(client, interaction);



    } // end isCommand 
    else if (interaction.isButton()) {
      const customId = interaction.customId
      const embed = new MessageEmbed()
      const member = interaction.member;
      const userRoles = member.roles.member._roles;
      console.log(interaction)

      
      if ('pr' === customId.substring(0, 2)) {
        const prId = await Get.item(db.Pr, {where: {slug: interaction.message.id}}).then(pr => pr)
        const board = interaction.channel.messages
        .fetch(
          await Get.item(db.Pr, {where: {slug: interaction.message.id}})
            .then(pr => pr.boardId)
        )

        if ('pr-merge' === customId) {
          // must be author or leadDev
          if ((!hadRole(userRoles, await getId('lead-dev')) && !(member.user.id === prId.userId))) {
            return interaction.reply({ content: '⚠️ ⚠️ ⚠️ Tu n\'as pas l\'autorisation ⚠️ ⚠️ ⚠️ ', ephemeral: true });
          }
          const button = await interaction.channel.messages
          .fetch(prId.slug)
          .then(msg => {
            const fetchedMsg = msg;
            const components = new MessageActionRow()
              .addComponents(
                  new MessageButton()
                      .setCustomId('pr-merge')
                      .setLabel('🤙 MERGE')
                      .setStyle('SUCCESS')
                      .setDisabled(true)
              )
            fetchedMsg.edit({ components: [components] })
          })



            await board.then(msg => {
              const fetchedMsg = msg;
              const boardEmbed = msg.embeds[0];
              boardEmbed.addFields({name: `${interaction.member.nickname}`, value: `🤙 merge : ${DateFormater.now()}`, inline: false})
              fetchedMsg.edit({ embeds: [boardEmbed] })
            })
          

            const components = new MessageActionRow()
              .addComponents(
                  new MessageButton()
                      .setCustomId('rm-channel')
                      .setLabel('OUI')
                      .setStyle('SUCCESS')
              )
              .addComponents(
                new MessageButton()
                    .setCustomId('rm-message')
                    .setLabel('NON')
                    .setStyle('DANGER')
              )


          interaction.reply({ content: '🤙 PR mergé,\nVoulez-vous supprimer le channel de la PR ?', components: [components] });
          // console.log(interaction.message)

        } else if ('pr-good' === customId) {

          await board.then(msg => {
            const fetchedMsg = msg;
            const boardEmbed = msg.embeds[0];
            boardEmbed.addFields({name: `${interaction.member.nickname}`, value: `👌 good : ${DateFormater.now()}`, inline: false})
            fetchedMsg.edit({ embeds: [boardEmbed] })
          })

          return interaction.reply({ content: '👌 Tu as bien validé la pr merci', ephemeral: true });

        } else if ('pr-warning' === customId) {

          await board.then(msg => {
            const fetchedMsg = msg;
            const boardEmbed = msg.embeds[0];
            boardEmbed.addFields({name: `${interaction.member.nickname}`, value: `⚠️ warning : ${DateFormater.now()}`, inline: false})
            fetchedMsg.edit({ embeds: [boardEmbed] })
          })

          return interaction.reply({ content: '⚠️ Tu as bien indiqué un probleme sur la pr merci', ephemeral: true });

        } else if ('pr-fixed' === customId) {
          // must be author
          if ((!hadRole(userRoles, await getId('lead-dev')) && !(member.user.id === prId.userId))) {
            return interaction.reply({ content: '⚠️ ⚠️ ⚠️ Tu n\'as pas l\'autorisation ⚠️ ⚠️ ⚠️ ', ephemeral: true });
          }

          await board.then(msg => {
            const fetchedMsg = msg;
            const boardEmbed = msg.embeds[0];
            boardEmbed.addFields({name: `${interaction.member.nickname}`, value: `🤞 fixed : ${DateFormater.now()}`, inline: false})
            fetchedMsg.edit({ embeds: [boardEmbed] })
          })

          return interaction.reply({ content: '🤞 Tu as bien corrigé les probleme sur la pr merci', ephemeral: true });

        } else if ('pr-aborded' === customId) {
          // must be author or leadDev
          if ((!hadRole(userRoles, await getId('lead-dev')) && !(member.user.id === prId.userId))) {
            return interaction.reply({ content: '⚠️ ⚠️ ⚠️ Tu n\'as pas l\'autorisation ⚠️ ⚠️ ⚠️ ', ephemeral: true });
          }

          const button = await interaction.channel.messages
            .fetch(prId.slug)
            .then(msg => {
              const fetchedMsg = msg;
              const components = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                      .setCustomId('pr-aborded')
                      .setLabel('🛑 ANNULE')
                      .setStyle('DANGER')
                      .setDisabled(true)
                )
                fetchedMsg.edit({ components: [components] })
            })


          await board.then(msg => {
            const fetchedMsg = msg;
            const boardEmbed = msg.embeds[0];
            boardEmbed.addFields({name: `${interaction.member.nickname}`, value: `🛑 aborded : ${DateFormater.now()}`, inline: false})
            fetchedMsg.edit({ embeds: [boardEmbed] })
          })

          const components = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('rm-channel')
                    .setLabel('OUI')
                    .setStyle('SUCCESS')
            )
            .addComponents(
              new MessageButton()
                  .setCustomId('rm-message')
                  .setLabel('NON')
                  .setStyle('DANGER')
            )


          interaction.reply({ content: '🛑 PR aborded,\nVoulez-vous supprimer le channel de la PR ?', components: [components] });
        }

        interaction.process
        console.log(customId)

      }// end PR interaction
      if ('rm-channel' === customId) {
        interaction.channel.delete()
      }
  
      if ('rm-message' === customId) {
        interaction.message.delete()
        interaction.reply('Contacter un admin pour supprimer le channel')
      }
      

    } // end isButton

  } catch (err) {
    console.log("Something Went Wrong => ",err);
  }
};

async function getId(slug)  {
  return await Get.item(db.Role, {where: {slug: slug}}).then(i => i._id)
}

function hadRole(roleList, id) {
  const list = roleList.filter(value => {
    return value.toString() === id.toString();
  })

  return list.length === 1;
}