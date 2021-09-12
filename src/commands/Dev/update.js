const { Client, Interaction } = require("discord.js");
const Regex = require('../../utils/regex');

module.exports = {
    name: 'update',
    description: 'Ping all for prod preprod update',
    roles: [
        {
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
                {name: "Adriver OPTI", value: "adriver"},
                {name: "Mobads OPTI", value: "mobads"},
                {name: "Simulation OPTI", value: "simulation"},
                {name: "Adriver Truck", value: "truck"},
                {name: "Adriver Car", value: "car"},
            ],
        },
        {
            name: 'type',
            description: 'type of application',
            required: true,
            type: 3,
            choices: [ // name = projet , value => url du depot
                {name: "Prod", value: "prod"},
                {name: "Pre-Prod", value: "preprod"},
            ],
        },
        {
            name: 'link',
            description: 'pull request url link',
            required: false,
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
            const options = interaction.options._hoistedOptions;
            const guild = interaction.guild;  
            const websites = require('../../../config/website.json');

            let application, type, typeName, link;
            for (let option in options) {
                option = options[option];
                switch (option.name) {
                    case 'application':
                        application = option.value
                        break;
                    case 'type':
                        type = option.value
                        typeName = (type === 'prod') ? 'Prod' : (type === 'preprod') ? 'Pre-Prod' : ''
                        break;
                    case 'link':
                        if (!Regex.isValidURL(option.value)) {
                            return interaction.reply({ content: '⚠️ ⚠️ ⚠️ Veuillez saisir une URL valid ⚠️ ⚠️ ⚠️ ', ephemeral: true });
                        } else {
                            link = option.value
                        }
                        break;
                    default:
                        break;
                }
            }

            const website = websites['adriverCorp'][application];

            let mesg = `@everyone\nLa **${typeName}** de **${website.name}** viens d'être mise en ligne sur ${link ?? website[type]} !`
            await interaction.channel.send(mesg).then(async i => {
                // send reply message
                await interaction.reply({content: 'update envoyé', ephemeral: true});
            })

        } catch (err) {
            console.log("Something Went Wrong => ", err);
        }
    }
};