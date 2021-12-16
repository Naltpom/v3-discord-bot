const done = require('../subCommandGroup/subCommand/done');
const notDone = require('../subCommandGroup/subCommand/notDone');

module.exports = {
	name: 'document',
	description: 'Add doc or note if you don\'t have writted docs',
	type: 2,
	options: [
		done,
		notDone,
	],
};