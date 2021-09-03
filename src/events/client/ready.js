require('dotenv-flow').config({silent: true});
const env = process.env;
const Create = require('../../sequelize/create');
const db = require('../../../config/db.config');
const sluger = require('slugify');

module.exports = async (client, Logger) => {
    console.log("Bot is Now Ready as", client.user.tag);

    const guilds = client.guilds.cache;

    let listRoleModel = [], listChannelModel = [], listUserModel = []

    // declare a promise to get time to collect all data before insert in DB
    Promise.all(guilds.map(async (guild) => {
        // collect all roles from all servers
        const roles = guild.roles.cache;
        roles.map(role => {
            listRoleModel.push({
                name: role.name,
                guild: role.guild.id,
                _id: role.id,
                slug: sluger(role.name, {lower: true})
            })
        })
        
        // collect all channels from all servers
        const channels = guild.channels.cache;
        channels.map(channel => {
            listChannelModel.push({
                name: channel.name,
                guild: channel.guild.id,
                _id: channel.id,
                slug: sluger(channel.name, {lower: true})
            })
        })
        
        // collect all members from all servers
        const members = await guild.members.fetch();
        return await members.map(m => {
            let rolelist = {};
            m._roles.map(r => {
                let rl = guild.roles.cache.get(r)
                rolelist[rl.name.toLowerCase()] = r
            })

            listUserModel.push({
                name: m.user.username,
                guild: m.guild.id,
                nickname: m.nickname ?? m.user.username,
                _id: m.id,
                role: rolelist,
                time: Date.now(),
                slug: m.user.id,
                slugName: sluger(m.user.username, {lower: true})
            })
        })
    }))
    .then(promises => {
        Create.syncDb(db.Role, listRoleModel)
        Create.syncDb(db.Channel, listChannelModel)
        Create.syncDb(db.User, listUserModel)
    })
}