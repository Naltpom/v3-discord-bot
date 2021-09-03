const { Client, Interaction, MessageEmbed } = require('discord.js');
require('dotenv-flow').config({silent: true});
const env = process.env;
const db = require('../../../config/db.config');
const Get = require('../../sequelize/get');
const {Op} = require ('Sequelize');
const DateFormater = require('../../utils/dateFormat');

async function getId(slug)  {
    return await Get.item(db.Role, {where: {slug: slug}}).then(i => i._id)
}

module.exports = {
    name: 'out',
    description: 'outs commands',
    roles: [
        {
            // id: getId('tech'),
            type: 2,
            permission: true
        },
        {
            // id: getId('cr'),
            type: 2,
            permission: true
        }
    ],
    options: [
        {
            name: 'get',
            description: 'name of the application',
            type: 1,
            options: [ 
                {
                    name: 'when',
                    description: 'type of application',
                    required: true,
                    type: 3,
                    choices: [ // name = projet , value => url du depot
                        {name: "Current", value: "current"},
                        {name: "Future", value: "future"},
                        {name: "Previous", value: "previous"},
                        {name: "All", value: "all"},
                    ]
                },
                {
                    name: 'user',
                    description: 'get a specific user out info',
                    require: false,
                    type: 6,
                }
            ],
        },
        {
            name: 'post',
            description: 'add you date out',
            type: 1,
            options: [ 
                {
                    name: 'date_start',
                    description: 'set date start',
                    require: true,
                    type: 3,
                },
                {
                    name: 'date_end',
                    description: 'set date end',
                    require: true,
                    type: 3,
                },
                {
                    name: 'user',
                    description: 'get a specific user out info',
                    require: false,
                    type: 6,
                }
            ],
        },
        {
            name: 'remove',
            description: 'pull request url link',
            type: 1,
            options: [ 
                {
                    name: 'user',
                    description: 'get a specific user out info',
                    require: false,
                    type: 6,
                }
            ],
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    execute: async (client, interaction) => {
        try {
            const guild = client.guilds.cache.get(env.SERVER);
            const options = interaction.options;
            const name = options._subcommand;
            const user = interaction.member.user.id;
            let embed;
    
            if ('get' === name) {embed = await get(options, db)}
            if ('post' === name) {embed = await post(options, db, guild, user)}
            if ('remove' === name) {embed = await remove(options, db, guild, user)}
            

            const mesg = await interaction.reply({ embeds: [embed], ephemeral: true });

        } catch (err) {
            console.log("Something Went Wrong => ", err);
        }
    }
}


async function get(obj, db) {
    const nextOptions = obj._hoistedOptions
    const embed = new MessageEmbed()

    let filter = {};
    let filterUser = {};
    
    for (let option in nextOptions) {
        const ob = nextOptions[option]

        if ('when' === ob.name) {
            const currentDate = new Date();
            if ('future' === ob.value) {
                embed.setTitle('Liste des futures absences');
                filter = {
                    ...filter,
                    startDate: {
                        [Op.gte]: currentDate
                    },
                };
            } else if ('current' === ob.value) {
                embed.setTitle('Liste des absences courante');
                filter = {
                    ...filter,
                    startDate: {
                        [Op.lte]: currentDate
                    },
                    endDate: {
                        [Op.gte]: currentDate
                    }
                };
            } else if ('previous' === ob.value) {
                embed.setTitle('Liste des anciennes absences');
                filter = {
                    ...filter,
                    endDate: {
                        [Op.lte]: currentDate
                    }
                };
            } 
        }
        if ('user' === ob.name) {
            filter = {...filter, userId: ob.value};
        }
    }

    const outs = await Get.collection(db.Out, {where: filter, order: [['startDate', 'ASC']]})

    let array = [];
    outs.map(out => {

        if (array.length === 0) {
            array.push({
                user: out.userId.toString(), 
                dates: [{
                    stringStartDate: DateFormater.format(out.startDate),
                    stringEndDate: DateFormater.format(out.endDate),
                    startDate: out.startDate,
                    endDate: out.endDate,
                }]
            })
        } else {
            let f;
            array.filter(item => {
                if (item.user === out.userId) {
                    item.dates.push({
                        stringStartDate: DateFormater.format(out.startDate),
                        stringEndDate: DateFormater.format(out.endDate),
                        startDate: out.startDate,
                        endDate: out.endDate,
                    })
                    f = true;
                } 
            })
            if (!f) {
                array.push({
                    user: out.userId.toString(), 
                    dates: [{
                        stringStartDate: DateFormater.format(out.startDate),
                        stringEndDate: DateFormater.format(out.endDate),
                        startDate: out.startDate,
                        endDate: out.endDate,
                    }]
                })
            }

        }
    })

    for (const item in array) {
        const userName = await Get.item(db.User, {where: {_id: array[item].user}}).then(o => (o === null) ?  null : o.nickname)

        if (null !== userName) {
            const dates = array[item].dates
            let message = '';
            for (const date in dates) {
                const first = (date == 0) ? 'Out' : 'Puis' ;
                if (dates[date].stringStartDate === dates[date].stringEndDate) {
                    message += `${first} le ${dates[date].stringStartDate} \n`
                } else {
                    message += `${first} du ${dates[date].stringStartDate} au ${dates[date].stringEndDate} \n`
                }
            }
            embed.addField(`${userName}`, message)
        }
    }    

    return embed
}

async function post(obj, db, guild, user) {
    const embed = new MessageEmbed()
    const nextOptions = obj._hoistedOptions
    const currentDate = new Date();
    let startDate, endDate = null, userId = user, status = false;

    for (let option in nextOptions) {
        const ob = nextOptions[option]
        if ('user' === ob.name) {
            userId = ob.value;
        }
        if ('date_start' === ob.name) {
            startDate = new Date(ob.value);
        }
        if ('date_end' === ob.name) {
            endDate = new Date(ob.value);
        }
    }
    if (null === endDate) {
        endDate = startDate
    }

    const outMember = await guild.members.fetch(userId);
    const member = await guild.members.fetch(user);
    embed.setTitle(`NEW out member`);

    if (currentDate >= startDate && currentDate <= endDate) {
        status = true;

        const role = await Get.item(db.Role, {where: {slug: 'out'}});
        outMember.roles.add(role._id.toString()).catch(console.error);
    }

    db.Out.create({
        userId: userId,
        slug: userId,
        startDate: startDate,
        endDate: endDate,
        status: status,
    });
    startDate = DateFormater.format(startDate)
    endDate = DateFormater.format(endDate)

    if (startDate !== endDate) {
        embed.addField(`${outMember.nickname ?? outMember.user.username}`, `*${member.nickname ?? member.user.username}* à defini **${outMember.nickname ?? outMember.user.username}** out du ${startDate} au ${endDate}`)
    } else {
        embed.addField(`${outMember.nickname ?? outMember.user.name}`, `*${member.nickname ?? member.user.name}* à defini **${outMember.nickname ?? outMember.user.name}** out le ${startDate}`)
    }

    return embed
}

async function remove(obj, db, guild, user) {
    const embed = new MessageEmbed()
    embed.setTitle(`Suppression des dates OUT`);
    let message = '';
    
    const nextOptions = obj._hoistedOptions
    let userId = user;
    const member = await guild.members.fetch(user);

    for (let option in nextOptions) {
        const ob = nextOptions[option]
        if ('user' === ob.name && (user === ob.value || user === ob.value)) {
            userId = ob.value;
        }
    }
    const outMember = await guild.members.fetch(userId);

    const outs = await Get.collection(db.Out, {where: {userId: userId}});
    outs.map(async (out) => {
        let startDate = out.startDate, endDate = out.endDate;
        startDate = DateFormater.format(startDate)
        endDate = DateFormater.format(endDate ?? startDate)
        if (startDate === endDate) {
            message += `Le ${startDate} \n`
        } else {
            message += `Le ${startDate} au ${endDate} \n`
        }

        await out.destroy();
    })

    const title = (outMember.user.id === member.user.id) ? `${member.nickname ?? member.user.name} a supprimer ses dates out` : `${member.nickname ?? member.user.name} a supprimer les dates out de ${outMember.nickname ?? outMember.user.name}`;

    embed.addField(`${title}`, `${message}`)

    return embed
}