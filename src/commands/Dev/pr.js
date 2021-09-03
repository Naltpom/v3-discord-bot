const { Client, Interaction, MessageEmbed } = require('discord.js');
require('dotenv-flow').config({silent: true});
const env = process.env;
const db = require('../../../config/db.config');
const Get = require('../../sequelize/get');
const UcFirst = require('../../utils/ucFirst');

async function getId(slug)  {
    // return await Get.item(db.Role, {where: {slug: slug}}).then(i => i._id)
}

module.exports = {
    name: 'pr',
    description: 'Send URL of a pull request',
    roles: [
        {
            id: getId('tech'),
            type: 2,
            permission: true
        }
    ],
    options: [
        {
            name: 'application',
            description: 'name of the application',
            required: true,
            type: 3,
            choices: [ // name = projet , value => url img
                {name: "Adriver", value: "adriver"},
                {name: "Mobads", value: "mobads"},
                {name: "Proxy", value: "proxy"},
                {name: "Simulation", value: "simulation"},
                {name: "Vitrine", value: "vitrine"},
            ],
        },
        {
            name: 'type',
            description: 'type of application',
            required: true,
            type: 3,
            choices: [ // name = projet , value => url du depot
                {name: "Adriver", value: "adriver"},
                {name: "Api", value: "api"},
                {name: "Athena", value: "athena"},
                {name: "Auth", value: "auth"},
                {name: "Datads", value: "datads"},
                {name: "Group", value: "group"},
                {name: "Middleware", value: "middleware"},
                {name: "Mobads", value: "mobads"},
                {name: "Notifier", value: "notifier"},
                {name: "Opti", value: "opti"},
                {name: "Proxy Client", value: "proxy-client"},
                {name: "Rgpd", value: "rgpd"},
                {name: "Simulation", value: "simulation"},
                {name: "Weproov", value: "weproov"},
            ],
        },
        {
            name: 'link',
            description: 'pull request url link',
            required: true,
            type: 3,
        },
        {
            name: 'description',
            description: 'Type the PR description',
            required: true,
            type: 3,
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
            const options = interaction.options._hoistedOptions;
            const thumbnails = require('../../../config/thumbnails.json');
            const name = options._subcommand;
            const user = interaction.member.user.id;

            let application, type, link, description;
            for (let option in options) {
                option = options[option];
                switch (option.name) {
                    case 'application':
                        application = option.value
                        break;
                    case 'type':
                        type = option.value
                        break;
                    case 'link':
                        link = option.value
                        break;
                    case 'description':
                        description = option.value
                        break;
                    default:
                        break;
                }
            }

            const embed = new MessageEmbed()
                .setColor(thumbnails[application].color)
                .setTitle(`Une nouvelle pull request a été postée !`)
                .setURL(link)
                .setThumbnail(thumbnails[application].link)
                .addFields(
                    {name: 'Application', value: UcFirst.format(application), inline: true},
                    {name: 'Auteur', value: interaction.member.user.username, inline: true},
                    {name: 'Type', value: UcFirst.format(type)},
                    {name: 'Description', value: UcFirst.format(description)}
                )
            ;      
            const mesg = await interaction.reply({ embeds: [embed], fetchReply: true })
                .then(msg => {
                    const emojisToAdd = ['👌', '⚠️', '🤞', '🤙', '🛑'];

                    emojisToAdd.map(emoji => {
                        msg.react(emoji).catch(e => console.error(e));
                    })
                })
                .catch(console.error);

        } catch (err) {
            console.log("Something Went Wrong => ", err);
        }
    }
}