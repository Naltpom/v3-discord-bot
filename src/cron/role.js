const Logger = require('../logger/logger');
const Get = require('../sequelize/get');

class CronRole
{
    static async outCheck(cron, scheduled, db, guilds) {

        let scheduledMessage = new cron.CronJob(scheduled, async () => {
            try {
                Logger.log('info',`{Class: CronRole, function: outCheck(), params: ${scheduled}} `, 'Cron')
                guilds.map(async guild => {

                    const outList = await Get.collection(db.Out, {where: {guild: guild.id}});
                    const currentDate = new Date().setHours(0,0,0,0);
        
                    await outList.map(async out => {
                        const formatStartDate = new Date(out.startDate).setHours(0,0,0,0);
                        const formatEndDate = new Date(out.endDate).setHours(0,0,0,0);
                        if (currentDate >= formatStartDate && currentDate <= formatEndDate) {
                            await out.update({status: true});
                        } else {
                            await out.update({status: false})
                        }
                        if (currentDate >= formatEndDate) {
                            await out.destroy()
                        }
                    })
        
                    const role = await Get.item(db.Role, {where: {slug: 'out', guild: guild.id}})
                    const users = await Get.collection(db.User, {where: {guild: guild.id}})
        
                    users.map(async user => {
                        const userOuts = await Get.collection(db.Out, {where: {userId: user._id, status: true}})
                        const member = await guild.members.fetch(user._id)
                        if (userOuts.length > 0) {
                            await member.roles.add(role.dataValues._id.toString()).catch(e => console.log(e));
                        } else {
                            member.roles.remove(role.dataValues._id.toString()).catch(e => console.log(e));
                        }
                    })
                });
            } catch (err) {
                Logger.log('error',`{Class: CronRole, function: outCheck(), Something Went Wrong => ${err}} `, 'Cron', err)
            }
        }, null, true, 'Europe/Paris')

        scheduledMessage.start();

    }
}

module.exports = CronRole;
