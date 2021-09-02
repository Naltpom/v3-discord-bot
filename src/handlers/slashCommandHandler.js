const fs = require("fs");

module.exports = async (client, Logger) => {
  const cmdFolders = fs.readdirSync("./src/commands");

  const cmdArr = [];
  client.on('ready', async () => {
    cmdFolders.forEach(cmdFolder => {
      const cmdFiles = fs.readdirSync(`./src/commands/${cmdFolder}`).filter(f => f.endsWith(".js"));

      cmdFiles.forEach(file => {
        const command = require(`../commands/${cmdFolder}/${file}`)

        if (command.name && command.execute) {
          client.slashCommands.set(command.name, command);
          cmdArr.push(command)
        }
      })
    });

    console.log("Ready Again");
    try {
      cmdArr.forEach(async cmd => {
        await client.guilds.cache.forEach(async guild =>{
          await guild?.commands.create(cmd).catch(err => {})
        })
      })
    } catch (err) {}
  })
}