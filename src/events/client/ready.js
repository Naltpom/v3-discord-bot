require('dotenv-flow').config({silent: true});
const env = process.env;
const Create = require('../../sequelize/create');
const db = require('../../../config/db.config');
const sluger = require('slugify');
const cronIndex = require('../../cron/_index')
const cron = require('cron');


module.exports = async (client, Logger) => {
    console.log("Bot is initiating", client.user.tag);
    const guild = await client.guilds.cache.get(env.SERVER);

    const guilds = client.guilds.cache;
    const listRoleModel = [], listChannelModel = [], listUserModel = []
    const neededRoles = ['CR', 'Lead Dev', 'Tech', 'Alternant', 'Out', 'Weekly']

    // declare a promise to get time to collect all data before insert in DB
    await Promise.all(guilds.map(async (guild) => {
        // check if role exist othewire create then
        console.log('Init roles')
        neededRoles.map(role => {
            const findRole = guild.roles.cache.find(guildRole => guildRole.name.toString() === role.toString())
            if (!findRole) guild.roles.create().then(e => {e.setName(role), console.log(`${role} create`)})
        })

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
                rolelist[sluger(rl.name.toLowerCase(), {lower: true})] = r
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
    }).then(async res =>  { console.log("Bot is Now Ready as", client.user.tag) })


    // CR
    cronIndex.Cr.reminder(cron, '0 00 18 * * MON-FRI', db, guild, 'first')
    cronIndex.Cr.reminder(cron, '0 45 21 * * MON-FRI', db, guild, 'second')
    cronIndex.Cr.reminder(cron, '0 00 22 * * MON-FRI', db, guild, 'last')
    cronIndex.Cr.lead(cron, '10 0 22 * * FRI', db, guild)
    // WEEKLY
    cronIndex.Weekly.reminder(cron, '0 0 16 * * FRI', db, guild)





}