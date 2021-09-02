const {Collection} = require("discord.js")

module.exports = async (client, Logger) => {
  client.events = new Collection();
  client.commands = new Collection();
  client.slashCommands = new Collection();
};