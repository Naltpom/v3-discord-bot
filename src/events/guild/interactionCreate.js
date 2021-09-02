const { Client, Interaction } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {Interaction} interaction
 */

module.exports = async (client, interaction) => {
  try {
    if (interaction.isCommand()) {
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd) return interaction.reply({content: "Something Went Wrong"});

      cmd.execute(client, interaction);
    }
  } catch (err) {
    console.log("Something Went Wrong => ",err);
  }
};