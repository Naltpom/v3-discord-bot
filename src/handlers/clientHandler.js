require('dotenv-flow').config({silent: true});
const env = process.env;
const {Collection} = require("discord.js")
const db = require('../../config/db.config');
const Get = require('../sequelize/get');

module.exports = async (client, Logger) => {
  client.events = new Collection();
  client.commands = new Collection();
  client.slashCommands = new Collection();

  client.on('guildMemberRemove', async member => {
    console.log('object on remove user', {_id: member.user.id, guild: env.SERVER})
    const user = await Get.item(db.User, {where: {_id: member.user.id, guild: env.SERVER}});
    user.destroy({where: {_id: member.user.id}});
  });
};