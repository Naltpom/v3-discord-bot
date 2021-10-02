const sluger = require('slugify');
const { cli } = require('winston/lib/winston/config');
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
                    table.create({
                        name: item.name,
                        guild: item.guildId,
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

    static async syncDb(table, list) {
        list.map(item => {
            table.findOne({where: {_id: item._id, guild: item.guild}})
                .then(element => {
                    if (element) { // update
                        try {
                            element.update(item)
                        } catch (err) {
                            console.log("Something Went Wrong => ",err);
                        }
                    } else { // create
                        try {
                            table.create(item)
                        } catch (err) {
                            console.log("Something Went Wrong => ",err);
                        }
                    }
                })
                .catch(e =>  Logger.log('error', e.message, 'database'))
        })

        table.sync();
        console.log("Database update => ",table)
    }

}

module.exports = Create;
