const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        guild: { type: DataTypes.STRING, allowNull: false, defaultValue: 'false' },
        nickname: { type: DataTypes.STRING, allowNull: false },
        _id: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.JSON, allowNull: false },
        time: { type: DataTypes.DATE, allowNull: false },
        slug: { type: DataTypes.STRING, allowNull: false },
        slugName: { type: DataTypes.STRING, allowNull: false},
    };

    return sequelize.define('users', attributes);
}
