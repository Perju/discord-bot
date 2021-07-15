require("dotenv").config();

const { Client } = require("discord.js");

const client = new Client();

const { dockStart } = require("@nlpjs/basic");
const { Language } = require("@nlpjs/language");

const language = new Language();

let nlp;
(async () => {
  const dock = await dockStart();
  nlp = dock.get('nlp');
})();

const response = async (message) => {
  let guess = language.guessBest(message.content, ["en", "es"]);
  return await nlp.process(guess.alpha2, message.content);
}
const PREFIX = "$";

const sms = require("./messages");
const messages = sms.text;
const getMessage = sms.util.getRndEl;

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

  // TODO usar nlp para los saludos
  // if (message.content.toLowerCase().includes("hola")) {
  //   let str = sms.util.getRndEl(sms.text.hello);
  //   message.channel.send(str + " " + message.author.username);
  // }

  if(message.channel.type === "dm" || message.mentions.users.some(user => user.id === client.user.id)){
    let message_out = response(message);
    message_out.then( (value)=>{
      message.channel.send(value.answer || "No entiendo que dices");
    })
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
