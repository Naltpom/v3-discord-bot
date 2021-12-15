const { format } = require('./ucFirst');
const { item, collection } = require('../sequelize/get');
const ObjectToCsv = require('objects-to-csv');
const db = require('../../config/db.config');

class Export
{
	/**
	 * @param {Client} client discord client
	 * @param {Interaction} interaction discord interaction
	 * @param {string=} type item or collection request
	 * @param {object=} options array of option for requesting db
	 * @return {Promise<void>}
	 */
	static async exportCsv(client, interaction, type = 'collection', options = {}) {
		const option = interaction.options._hoistedOptions;
		let data, table;

		table = format(option[0].value);

		switch (type) {
			case 'item':
				data = await item(db[table], options).then(data => data);
				break;
		}

		data = await collection(db[table], options).then(data => data);

		if (data.length === 0) {
			await interaction.reply({content: "Il n'y a aucune données à exporter.", ephemeral: true});

			return;
		}

		const objectToFormat = [];
		data.map(i => {
			objectToFormat.push(i.dataValues);
		});

		try {
			await (async () => {
				const csv = new ObjectToCsv(objectToFormat);
				const path = `./var/${table}.csv`;
				await csv.toDisk(path, {}).then(() => {
					client.users.fetch(interaction.user.id).then(user => {
						user.send({
							content: `Voici l'export de **'${table}'** que tu as demandé`,
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

module.exports = Export;