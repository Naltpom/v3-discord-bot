const Logger = require('../logger/logger');
const Get = require('../Sequelize/get');

class Weekly
{
    static async reminder (cron, scheduled, db, guild) {

        let scheduledMessage = new cron.CronJob(scheduled, async () => {
            try {
                Logger.log('info',`{Class: Weekly, function: reminder(), params: ${scheduled}} `, 'Cron')
                let roleId = await Get.item(db.Role, {where: {slug: 'weekly', guild: guild.id}}).then(i => i._id)
                let channelId = await Get.item(db.Channel, {where: {slug: '_opti_', guild: guild.id}}).then(i => i._id)

                guild.channels.cache.get(channelId).send(`<@&${roleId}>, Jaafar attend vos weeklies. Merci et bon weekend :partying_face:`)
            } catch (err) {
                Logger.log('error',`{Class: Weekly, function: reminder(), Something Went Wrong => ${err}} `, 'Cron', err)
            }
        }, null, true, 'Europe/Paris');

        scheduledMessage.start();
    }
}

module.exports = Weekly;
0