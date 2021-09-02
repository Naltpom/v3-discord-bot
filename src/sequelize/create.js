const sluger = require('slugify');
const Logger = require('../logger/logger');

class Create {
    static async create(table, data, reset = false) {

        if (true === reset) {
            await table.drop();
            await table.sync();
            Logger.log('info', `{${table}} has been reset`, 'database')
        }

        data.map(item => {
           table.findOne({where: {_id: item.id}}).then(obj => {
                if (null == obj) {
                    if (table === 'Roles') {
                        console.log(item.name)
                    }
                    table.create({
                        name: item.name,
                        slug: sluger(item.name, {lower: true}),
                        _id: item.id
                    })
                    .then(success => Logger.log('info', `{${table}: ${success._id}} has been created`, 'database'))
                    .catch(e =>  Logger.log('error', e.message, 'database'));
                }
            });
        });

        table.sync();
    }

    
    static async sqlUsers(table, guild) {
        await guild.members.fetch().then(u => {
            u.map(m => {           
                let rolelist = {};
                m._roles.map(r => {
                    let rl = guild.roles.cache.get(r)
                    rolelist[rl.name.toLowerCase()] = r
                })

                table.findOne({where: {_id: m.user.id}}).then(item => {
                    if (item) {
                        Logger.log('info',`update ${m.user.username} in DB user`, 'database')
                        return item.update({
                            name: m.user.username,
                            nickname: m.nickname ?? m.user.username,
                            role: rolelist,
                            time: Date.now()
                        });
                    } else {
                        Logger.log('info',`create ${m.user.username} in DB user`, 'database')

                        return table.create({
                            name: m.user.username,
                            nickname: m.nickname ?? m.user.username,
                            _id: m.user.id,
                            slug: m.user.id,
                            role: rolelist,
                            time: Date.now(),
                            slugName: sluger(m.user.username, {lower: true}),
                        });
                    }
                })
            })
        })
    }
}

module.exports = Create;
