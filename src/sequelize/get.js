const Logger = require('../logger/logger');

class Get {
    static async item(table, filters = {}) {
        return await table.findOne(filters)
            .then(obj => {
                Logger.log('info', `${obj}`, 'database', 'get');
                return obj;
            })
            .catch(e => Logger.log('error', e.message, 'database'))
        ;
    }

    static async collection(table, filters = {}) {

        // filter example => {_id: item.id}
        return await table.findAll(filters)
            .then(obj => {
                Logger.log('info', `${obj}`, 'database', 'get');
                return obj
            })
            .catch(e =>  Logger.log('error', e.message, 'database'))
        ;
    }
}

module.exports = Get;
