const { exportCsv } = require('../utils/export');
const { Client } = require('discord.js');
const moment = require('moment');

class Document
{
	/**
	 * @param cron
	 * @param {string} scheduled what time to activate cron
	 * @param table
	 * @param {Client} client Discord client
	 * @returns {Promise<void>}
	 */
	static async export(cron, scheduled, table, client) {
		let scheduledMessage = new cron.CronJob(scheduled, async () => {
			await exportCsv(
				client,
				table,
				'546426730718691329',
				'collection',
				{
					where: {
						publicationDate: new Date(moment().subtract(6, 'days').toString())
					}
				}
			);
		});

		scheduledMessage.start();
	}
}

module.exports = Document;