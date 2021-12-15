require('dotenv-flow').config({silent: true});
const env = process.env;
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const Logger = require('../src/logger/logger');
initialize().then();

let db;

module.exports = db = {};

async function initialize() {

	const config = {
		'host': env.DATABASE_HOST,
		'port': env.DATABASE_PORT,
		'user': env.DATABASE_USERNAME,
		'password': env.DATABASE_PASSWORD,
		'database': env.DATABASE_NAME,
	};
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql', logging: msg => Logger.log('info', msg, 'init-db') });

    // init models and add them to the exported db object
    db.Channel = require('../src/models/channel.model')(sequelize);
    db.Role = require('../src/models/role.model')(sequelize);
    db.Out = require('../src/models/out.model')(sequelize);
    db.User = require('../src/models/user.model')(sequelize);
    db.CrLeaderboard = require('../src/models/crLeaderboard.model')(sequelize);
    db.Pr = require('../src/models/pr.model')(sequelize);
    db.Notion = require('../src/models/notion.model')(sequelize);
    db.User.sync({ force: true });
    db.Role.sync({ force: true });
    db.Channel.sync({ force: true });
    // sync all models with database
    await sequelize.sync();
}
