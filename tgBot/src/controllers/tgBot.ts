import { Telegraf } from "telegraf";

export function setupBotCommands(bot: Telegraf) {
  bot.start((ctx) => ctx.reply("Добро пожаловать!"));
  bot.help((ctx) => ctx.reply("Как я могу помочь?"));
  bot.on("text", (ctx) => ctx.reply(`Вы сказали: ${ctx.message.text}`));
}
