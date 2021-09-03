require('dotenv-flow').config({silent: true});
const env = process.env;
const Create = require('../../sequelize/create');
const db = require('../../../config/db.config');
const sluger = require('slugify');
const { Role } = require('discord.js')

module.exports = async (client, Logger) => {
    console.log("Bot is Now Ready as", client.user.tag);

    const guilds = client.guilds.cache;

    let listRoleModel = [], listChannelModel = [], listUserModel = []
    const neededRoles = ['CR', 'Lead Dev', 'Tech', 'Alternant', 'Out', 'Weekly']
    const neededChannel = [{ name: 'pr', type: 'GUILD_CATEGORY' }, { name: 'pr', type: 'GUILD_TEXT' }, { name: 'notion', type: 'GUILD_TEXT' }]

    // declare a promise to get time to collect all data before insert in DB
    Promise.all(guilds.map(async (guild) => {
        // check if role exist othewire create then
        neededRoles.map(role => {
            const findRole = guild.roles.cache.find(guildRole => {console.log(`${guildRole.name.toString()}`, role.toString(), guildRole.name.toString() === role.toString());return guildRole.name.toString() === role.toString()})
            if (!findRole) guild.roles.create().then(e => {e.setName(role), console.log(`${role} create`)})
        })

        // // check if channel exist othewire create then
        // neededChannel.map(channel => {
        //     const findChannel = guild.channels.cache.find(guildChannel => {console.log(`${guildChannel.name.toString()}`, channel.toString(), guildChannel.name.toString() === channel.toString());return guildChannel.name.toString() === channel.name.toString()})
        //     if (!findChannel) guild.channels.create().then(e => {e.setName(channel.name), console.log(`${role} create`)})
        // })

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
        
        let channels = guild.channels.cache;
                
        // collect all channels from all servers
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