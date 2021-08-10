import dotenv from 'dotenv';
dotenv.config();
import PGDiscordBot from "./index.js";
let bot = new PGDiscordBot({env: process.env});
bot.initBot();
