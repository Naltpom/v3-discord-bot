require('dotenv-flow').config({silent: true});
const env = process.env;
const { Client, Intents } = require("discord.js");
const Logger = require('./src/logger/logger');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const db = require('./config/db.config').initialize;
const { readdirSync } = require("fs");

const handlers = readdirSync("./src/handlers/").filter((f) => f.endsWith(".js"));

handlers.forEach((hanlder) => {
  require(`./src/handlers/${hanlder}`)(client, Logger);
});

client.login(env.TOKEN).catch(console.error);
