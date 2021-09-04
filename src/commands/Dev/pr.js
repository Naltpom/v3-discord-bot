const { Client, Interaction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
require('dotenv-flow').config({silent: true});
const env = process.env;
const db = require('../../../config/db.config');
const UcFirst = require('../../utils/ucFirst');

async function getId(slug)  {
    //return await Get.item(db.Role, {where: {slug: slug, guild: guildId}}).then(i => i._id)
}

function isValidURL(string) {
    const res = string.match(/(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-zA-Z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};

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
            const guild = interaction.guild;           
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

            if (!isValidURL(link)) {
                return interaction.reply({ content: '⚠️ ⚠️ ⚠️ Veuillez saisir une URL valid ⚠️ ⚠️ ⚠️ ', ephemeral: true });
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

            const components = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('pr-merge')
                        .setLabel('🤙 MERGE')
                        .setStyle('SUCCESS')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('pr-good')
                        .setLabel('👌 GOOD')
                        .setStyle('SUCCESS')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('pr-warning')
                        .setLabel('⚠️ NEED CHANGE')
                        .setStyle('PRIMARY')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('pr-fixed')
                        .setLabel('🤞 FIXED')
                        .setStyle('SECONDARY')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('pr-aborded')
                        .setLabel('🛑 ANNULE')
                        .setStyle('DANGER')
                )

            const int = await db.Pr.findAndCountAll().then(e => e)

            const category = (await guild.channels.fetch(undefined)).find(cat => cat.name === 'pr' && cat.type === 'GUILD_CATEGORY')

            guild.channels.create(`pr-${int.count + 1}`, {parent: category})
                .then(async channel => {
                    channel.send(`<@${interaction.member.user.id}>`)

                    const boardEmbed = new MessageEmbed()
                        .setTitle('Info Board')
                    return [
                        await channel.send({ embeds: [embed], components: [components], fetchReply: true }), 
                        await channel.send({embeds: [boardEmbed]})
                    ]
                })
                .then(msgs => {
                    db.Pr.create({
                        _id: msgs[0].id,
                        guild: guild.id,
                        userId: interaction.member.user.id,
                        slug: msgs[0].id,
                        boardId: msgs[1].id,
                        application: application,
                        type: type,
                        link: link,
                        description: description,
                        status: 'pr-created',
                    });
                })
                .then(async e =>  {
                    const msg = await interaction.reply({ content: 'PR Created', ephemeral: true })
                        .catch(console.error)

                })
                .catch(console.error)




            // const mesg = await interaction.reply({ embeds: [embed], components: [components], fetchReply: true })
                // .then(msg => {
                //     const emojisToAdd = ['👌', '⚠️', '🤞', '🤙', '🛑'];

                //     emojisToAdd.map(emoji => {
                //         msg.react(emoji).catch(e => console.error(e));
                //     })
                // })
                // .catch(console.error);


        } catch (err) {
            console.log("Something Went Wrong => ", err);
        }
    }
}