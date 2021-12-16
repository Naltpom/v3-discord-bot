module.exports = {
	name: 'done',
	description: 'If you have writted doc',
	type: 1,
	options: [
		{
			name: 'name',
			description: 'Name of the document',
			type: 3,
			required: true,
		},
		{
			name: 'link',
			description: 'Link of the documentation',
			type: 3,
			required: true,
		},
		{
			name: 'percent',
			description: 'Percentage of done',
			type: 4,
			required: true,
		},
		{
			name: 'hours',
			description: 'Hours spent writting docs',
			type: 4,
			required: true,
		},
		{
			name: 'note',
			description: 'If you want to say something',
			type: 3,
			required: false,
		},
	],
};