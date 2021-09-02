require('dotenv-flow').config({silent: true});
const env = process.env;
const Create = require('../../sequelize/create');
const db = require('../../../config/db.config');

module.exports = async (client, Logger) => {
    console.log("Bot is Now Ready as", client.user.tag);

    const guild = client.guilds.cache.get(env.SERVER);
    const roles = guild.roles.cache;
    const channels = guild.channels.cache;
    const commands = await client.api.applications(client.user.id).guilds(env.SERVER).commands.get();

    Create.create(db.Role, roles, true).catch(e => {console.log(e), Logger.log('error', e.message, 'database')});
    Create.create(db.Channel, channels, true).catch(e => {console.log(e), Logger.log('error', e.message, 'database')});
    Create.create(db.Command, commands, true).catch(e => {console.log(e), Logger.log('error', e.message, 'database')});
    Create.sqlUsers(db.User, guild).catch(e => {console.log(e), Logger.log('error', e.message, 'database')});

}