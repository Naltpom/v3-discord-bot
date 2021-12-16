const { DataTypes } = require('sequelize');

module.exports = document;

function document(sequelize) {
	const attributes = {
		user: { type: DataTypes.STRING, allowNull: false },
		name: { type: DataTypes.STRING, allowNull: true },
		percent: { type: DataTypes.INTEGER, allowNull: true },
		link: { type: DataTypes.STRING, allowNull: true},
		hours: { type: DataTypes.INTEGER, allowNull: true},
		publicationDate: { type: DataTypes.DATE, allowNull: false},
		note: { type: DataTypes.STRING, allowNull: true},
	};

	return sequelize.define('documents', attributes);
}
