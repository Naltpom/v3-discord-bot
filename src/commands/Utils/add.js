const { Client, Interaction } = require('discord.js');
const { isValidUrl } = require('../../utils/regex');
const db = require('../../../config/db.config');
const document = require('../subCommandGroup/document');

module.exports = {
	name: 'add',
	description: 'Add document or note if you don\'t have writted docs',
	options: [
		document,
	],
	roles: [
		{
			id: 850494667014406144,
			type: 2,
			permission: true
		},
	],
	/**
	 * @param {Client} client
	 * @param {Interaction} interaction
	 * @returns {Promise<void>}
	 */
	execute: async (client, interaction) => {
		const subCommand = interaction.options._subcommand;
		const options = interaction.options._hoistedOptions;

		switch (subCommand) {
			case 'done':
				await done(options, interaction);
				break;
			case 'not-done':
				await notDone(options, interaction);
				break;
			default:
				return;
		}
	}
}

const done = async (options, interaction) => {
	const document = {
		user: interaction.user.username,
		publicationDate: new Date(),
	};

	options.map(i => {
		if ('link' === i.name && !isValidUrl(i.value)) {
			return interaction.reply({content: '⚠️ ⚠️ ⚠️ Veuillez saisir une URL valide ⚠️ ⚠️ ⚠️ ', ephemeral: true});
		}
		document[i.name] = i.value
	})

	try	{
		await db.Document.create(document);

		await interaction.reply({content: "Document ajouté avec succès", ephemeral: true});
	} catch (error) {
		await interaction.reply({content: error.message, ephemeral: true});
	}
}

const notDone = async (options, interaction) => {
	try	{
		await db.Document.create(
			{
				user: interaction.user.username,
				note: options.value,
				publicationDate: new Date()
			}
		);

		await interaction.reply({content: "Document ajouté avec succès", ephemeral: true});
	} catch (error) {
		await interaction.reply({content: error.message, ephemeral: true});
	}
}
