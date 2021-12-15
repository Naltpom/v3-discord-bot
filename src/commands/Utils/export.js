const { Client, Interaction } = require('discord.js');
require('dotenv-flow').config({ silent: true });
const { format } = require('../../utils/ucFirst');
const { collection } = require("../../sequelize/get");
const db = require('../../../config/db.config');
const ObjectToCsv = require('objects-to-csv');

module.exports = {
    name: 'export',
    description: 'Export a table from databse',
    roles: [
        {
            id: 850494667014406144,
            type: 2,
            permission: true
        },
    ],
    options: [
        {
            name: 'table',
            description: 'Name of the table you want to export',
            required: true,
            type: 3,
            choices: [
                {name: 'Channel', value: 'channel'},
                {name: 'CrLeaderBoard', value: 'crleaderboard'},
                {name: 'Out', value: 'out'},
                {name: 'Pr', value: 'pr'},
                {name: 'User', value: 'user'},
            ],
        },
    ],
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     * @returns {Promise<void>}
     */
    execute: async (client, interaction) => {
        const options = interaction.options._hoistedOptions;

        if (options.length) {
            const table = format(options[0].value);
            const data = await collection(db[table])
                .then(data => data)
            ;

            const objectToFormat = [];
            data.map(i => {
                objectToFormat.push(i.dataValues);
            });
            try {
                await (async () => {
                    const csv = new ObjectToCsv(objectToFormat);
                    const path = `./var/${table}.csv`;
                    await csv.toDisk(path).then(() => {
                        client.users.fetch(interaction.user.id).then(user => {
                            user.send({
                                content: "Voici l'export que tu as demandé",
                                files: [path]
                            });
                        });
                    });
                })();

                await interaction.reply({content: "L'export a bien été effectué", ephemeral: true});
            } catch (err) {
                console.log("Something Went Wrong => ", err);
            }
        }
    }
}
