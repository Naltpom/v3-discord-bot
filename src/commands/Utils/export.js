const { Client, Interaction } = require('discord.js');
const Export = require('../../utils/export.js');

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
        await Export.exportCsv(client, interaction);
    }
}
