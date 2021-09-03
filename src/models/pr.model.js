const { DataTypes } = require('sequelize');

module.exports = pr;

function pr(sequelize) {
    const attributes = {
        _id: { type: DataTypes.STRING, allowNull: false },
        guild: { type: DataTypes.STRING, allowNull: false },
        userId: { type: DataTypes.STRING, allowNull: false },
        slug: { type: DataTypes.STRING, allowNull: false },
        boardId: { type: DataTypes.STRING, allowNull: false },
        application: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false },
        link: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false, defaultValue: false },
    };

    return sequelize.define('pr', attributes);
}

