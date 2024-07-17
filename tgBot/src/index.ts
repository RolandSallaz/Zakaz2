import dotenv from "dotenv";
import express, { Express } from "express";
import { Telegraf } from "telegraf";
import { setupBotCommands } from "./controllers/tgBot";
import errorHandler from "./middlewares/errorHandler";
import { errorLogger, requestLogger } from "./middlewares/logger";
import router from "./router";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.IS_DEV
  ? process.env.DEV_TG_API_KEY || ""
  : process.env.TG_API_KEY || "";
export const tgAdminId = process.env.TG_CHAT_ID || "";
export const bot = new Telegraf(apiKey);

// Запуск бота
setupBotCommands(bot);
bot.launch();

app.use(express.json());
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Сервис запущен на порту ${port}`);
});
