const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        userId: { type: DataTypes.STRING, allowNull: false },
        guild: { type: DataTypes.STRING, allowNull: false },
        reminder: { type: DataTypes.STRING, allowNull: false },
    };

    return sequelize.define('crLeaderboard', attributes);
}
