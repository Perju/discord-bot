import axios from "axios";
import { Client } from "discord.js";

class PGDiscordBot {
  constructor(config) {
    this.env = config.env;
    this.relations = {};
    this.client = new Client();
  }

  async initBot() {
    this.client.on("ready", () => {
      console.log(`${this.client.user.tag} se ha conectado`);
    });

    this.client.on("presenceUpdate", (oldPres, newPres) => {
      if (newPres.status === "online") {
        const user = newPres.user;
        let mensaje = getMessage(messages.welcome);
        user.send(mensaje + " " + user.username);
      }
    });

    this.client.on("message", (message) => {
      if (message.author.bot) return;

      if (
        message.channel.type === "dm" ||
        message.mentions.users.some((user) => user.id === this.client.user.id)
      ) {
        const relacion = this.relations[message.author.username] || "neutral";
        let message_out = this.getResponse(
          this.env.NLP_URL,
          message.content,
          message.author.username,
          relacion
        );
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

    this.client.login(this.env.DISCORDJS_BOT_TOKEN);
  }

  async getResponse(url, message, nombre, relacion) {
    const options = {
      method: "GET",
      url: url,
      json: true,
      data: { frase: message, nombre: nombre, relacion: relacion },
    };
    return await axios(options);
  }
}

const PREFIX = "$";

export { PGDiscordBot };
