const Logger = require('../logger/logger');
const Get = require('../sequelize/get');
const { Op, fn, col, literal } = require('sequelize');
const { MessageEmbed  } = require("discord.js");
const moment = require('moment')

class CronCr
{
    static reminder (cron, scheduled, db, guild, reminder) {
        const scheduledMessage = new cron.CronJob(scheduled, async () => {
            try {
                Logger.log('info',`{Class: CronCr, function: reminder(), params: ${scheduled}} `, 'Cron')
        
                const channelId = await Get.item(db.Channel, {where: {slug: '_cr_tech_', guild: guild.id}}).then(i => i._id)
                const authors = await guild.channels.cache.get(channelId.toString()).messages.fetch()
        
                // fetch users that havn't done CR
                let users = await Get.collection(db.User, {
                    where: {
                        guild: { [Op.eq]: guild.id },
                        [Op.and]: [
                            fn('json_extract', col('role'), literal(`'$.cr'`)),
                            fn('isnull', fn('json_extract', col('role'), literal(`'$.out'`)))
                        ],
                    }
                })

                const channelMembers = [];
                authors.map(message => {
                    const timestamp = (new Date()).setHours(12, 0, 0, 0);

                    if (
                        message.createdTimestamp > timestamp && 
                        null !== message.author.id && 
                        message.content.substring(0, 2).toUpperCase() === "CR" && (
                            message.content.toLowerCase().includes('todo') || 
                            message.content.toLowerCase().includes('to do')
                        )

                    ) {
                        channelMembers.push({"id": message.author.id});
                    }
                });
                
                const uniques = [...new Set(channelMembers.map(item => item.id))];

                let crTodo = []

                users.map(user => {
                    if (!uniques.includes(user._id)) {
                        crTodo.push(user);
                        db.CrLeaderboard.create({
                            userId: user._id,
                            reminder: reminder,
                            guild: guild.id,
                        });
                    }
                })


                // Send message in channel to ask for the CR
                let reply = ``;

                if (crTodo.length) {
                    crTodo.forEach(user => {
                        reply += `<@${user._id}>, `;
                    })
                    if ('first' === reminder) {
                        reply += `pourriez-vous faire votre CR avant 22h, Thanks !`
                    } else if('second' === reminder) {
                        reply += `il vous reste 15 minutes pour faire votre CR, Merci !`
                    } else if('last' === reminder)  {
                        reply += `temps écoulé, pourriez-vous faire votre CR le plus rapidement possible, Merci à tous pour vos CRs!`
                    }
                } else {
                    reply = `Merci à tous pour vos CRs`;
                }
                console.log(reply);

                guild.channels.cache.get(channelId.toString()).send(reply);

            } catch (err) {
                Logger.log('error',`{Class: CronCr, function: reminder(), Something Went Wrong => ${err}} `, 'Cron', err)
            }

        }, null, true, 'Europe/Paris');

        scheduledMessage.start();
    }

    static async lead (cron, scheduled, db, guild) {
        const scheduledMessage = new cron.CronJob(scheduled, async () => {
            try {
                Logger.log('info',`{Class: CronCr, function: lead(), params: ${scheduled}} `, 'Cron')
                const channelId = await Get.item(db.Channel, {where: {slug: '_cr_tech_', guild: guild.id}}).then(i => i._id)
                let users = await db.CrLeaderboard.findAll({
                    attributes: [
                        'userId', 'reminder',
                        [fn('COUNT', 'userId'), 'count'],
                    ],
                    where: {
                        reminder: {[Op.eq]: 'last'},
                        guild: {[Op.eq]: guild.id},
                        createdAt: {[Op.gte]: moment().startOf('week')}
                    },
                    group: 'userId',
                    order: [[fn('COUNT', 'userId'), 'DESC'], ['reminder', 'DESC']]
                });



                const data = {ids: [], items: []}
                users.map( (user) => {
                    data.ids.push(user.dataValues.userId)
                    data.items.push(user.dataValues)
                })

                const usersArray = await Get.collection(db.User, {
                    where: {
                        _id: { [Op.in]: data.ids },
                        guild: { [Op.eq]: guild.id },
                    }
                })

                const newData = []
                usersArray.map(usItem => {
                    const i = usItem.dataValues
                    data.items.map((item) => {
                        if (i._id === item.userId) {
                            newData.push({...i, ...item})
                        }
                    })
                })

                let msg = 'Tableau recapitulatif des CR non fait: \n\n'
                newData.map(user => {
                    const total = user.count * ((user.count >= 5) ? 10 : (user.count === 4) ? 8 : 5)
                    msg +=  `**${user.nickname}** \`${user.count}\` => *${total}*\n`
                })

                const embed = new MessageEmbed()
                    .setColor('#FF0000')
                    .setTitle('Board des CR')
                embed.setDescription(msg)

                guild.channels.cache.get(channelId.toString()).send({embeds: [embed]});

            } catch (err) {
                Logger.log('error',`{Class: CronCr, function: lead(), Something Went Wrong => ${err}} `, 'Cron', err)
            }

        }, null, true, 'Europe/Paris');

        scheduledMessage.start();
    }
}

module.exports = CronCr;