require("dotenv").config();
const axios = require("axios");
const { Client } = require("discord.js");

const client = new Client();

const response = async (message, nombre) => {
  const options = {
    method: "GET",
    url: "http://127.0.0.1:3000/nlp",
    json: true,
    data: { frase: message, nombre: nombre },
  };
  return await axios(options);
};
const PREFIX = "$";

client.on("ready", () => {
  console.log(`${client.user.tag} se ha conectado`);
});

client.on("presenceUpdate", (oldPres, newPres) => {
  if (newPres.status === "online") {
    const user = newPres.user;
    let mensaje = getMessage(messages.welcome);
    user.send(mensaje + " " + user.username);
  }
});

client.on("message", (message) => {
  if (message.author.bot) return;

  if (
    message.channel.type === "dm" ||
    message.mentions.users.some((user) => user.id === client.user.id)
  ) {
    let message_out = response(message.content, message.author.username);
    message_out.then((response) => {
      let responseTxt = response.data || "No entiendo que dices";
      message.channel.send(responseTxt);
    });
  }

  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substr(PREFIX.length)
      .split(/\s+/);

    if (CMD_NAME === "kick") {
      if (!message.member.hasPermission("KICK_MEMBERS")) {
        message.reply("No tienes permisos para usar ese comando");
      }
      if (args.length === 0) {
        message.reply("Porfavor dame una ID");
        return;
      }

      const member = message.guild.members.cache.get(args[0]);
      if (member) {
        member
          .kick()
          .then((member) => message.channel.send(`${member} fue expulsado`))
          .catch((err) => message.channel.send("No tengo permisos"));
      } else {
        message.channel.send("Usuario no encontrado");
      }
    }
  }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
