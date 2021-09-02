module.exports = async (client, message) => {
    const PREFIX = "!"; //change it according to your need
  
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;
  
    const args = message.content.slice(PREFIX.length).split(/[ ]+/);
    const command = args.shift().toLowerCase();
    if (!command.length) return;
  
    const cmd = client.commands.get(command);
    if (!cmd) return;
  
    console.log("Hello");
    cmd.execute(client, message, args, PREFIX);
}