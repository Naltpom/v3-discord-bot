const { Client, Interaction } = require('discord.js');
const { exportCsvInteraction } = require('../../utils/export.js');
const { getAnswer } = require('../../client/jservice');

module.exports = {
	name: 'jaafar',
	description: 'Send a question to Jaafar, use it when he types on discord while being in holidays',
	options: [
		{
			name: 'count',
			description: 'Number of questions to send, a maximum of 3 is authorized',
			required: false,
			type: 4,
		},
	],
	/**
	 * @param {Client} client
	 * @param {Interaction} interaction
	 * @returns {Promise<void>}
	 */
	execute: async (client, interaction) => {
		let options;
		if (interaction.options._hoistedOptions > 0) {
			options = interaction.options._hoistedOptions[0].value;
		}

		// getAnswer(options);

		console.log(getAnswer(options))
	}
}