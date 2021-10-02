const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        slug: { type: DataTypes.STRING, allowNull: false },
    };

    return sequelize.define('notion', attributes);
}
