const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        userId: { type: DataTypes.STRING, allowNull: false },
    };

    return sequelize.define('crLeaderboard', attributes);
}
