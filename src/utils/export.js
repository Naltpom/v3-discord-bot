const { format } = require('./ucFirst');
const { item, collection } = require('../sequelize/get');
const ObjectToCsv = require('objects-to-csv');
const db = require('../../config/db.config');

/**
 *
 * @param {string} table name of the table to export
 * @param {object=} options array of option for requesting db
 * @param {string} type item or collection request
 */
async function getData(table, type, options) {
	switch (type) {
	case 'item':
		return item(db[table], options).then(data => data);
	case 'collection':
		return collection(db[table], options).then(data => data);
	}
}

function createCsv(client, data, table, user) {
	(async () => {
		const csv = new ObjectToCsv(data);
		const path = `./var/${table}.csv`;
		await csv.toDisk(path, {}).then(() => {
			client.users.fetch(user).then(user => {
				user.send({
					content: `Voici l'export de **'${table}'** que tu as demandé`,
					files: [path]
				});
			});
		});
	})();
}

class Export
{
	/**
	 * @param {Client} client discord client
	 * @param {Interaction} interaction discord interaction
	 * @param {string=} type item or collection request
	 * @param {object=} options array of option for requesting db
	 * @return {Promise<void>}
	 */
	static async exportCsvInteraction(client, interaction, type = 'collection', options = {}) {
		const option = interaction.options._hoistedOptions;
		const table = format(option[0].value);
		const data = await getData(table, type, options);

		if (data.length === 0) {
			await interaction.reply({content: "Il n'y a aucune données à exporter.", ephemeral: true});

			return;
		}

		const objectToFormat = [];
		data.map(i => {
			objectToFormat.push(i.dataValues);
		});

		const userId = interaction.user.id;
		try {
			createCsv(client, objectToFormat, table, userId);

			await interaction.reply({content: "L'export a bien été effectué", ephemeral: true});
		} catch (err) {
			console.log("Something Went Wrong => ", err);
		}
	}

	/**
	 * @param {Client} client discord client
	 * @param {string} table name of the table to export
	 * @param {string} user Id of the user to send csv
	 * @param {string=} type item or collection request
	 * @param {object=} options array of option for requesting db
	 * @return {Promise<void>}
	 */
	static async exportCsv(client, table, user, type = 'collection', options = {}) {
		const data = await getData(table, type, options);

		if (data.length === 0) {
			return;
		}

		const objectToFormat = [];
		data.map(i => {
			objectToFormat.push(i.dataValues);
		});

		try {
			createCsv(client, objectToFormat, table, user);
		} catch (err) {
			console.log("Something Went Wrong => ", err);
		}
	}
}

module.exports = Export;