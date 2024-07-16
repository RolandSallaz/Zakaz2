import { Router } from "express";
import { CustomError } from "../errors/CustomError";
import { bot, tgAdminId } from "..";

const router = Router();
router.post("/sendMessageToAdmin", (req, res, next) => {
  bot.telegram
    .sendMessage(tgAdminId, req.body.message)
    .then(() => res.end())
    .catch(next);
});
router.use("*", (req, res, next) =>
  next(new CustomError("Ресурс не найден", 404))
);
export default router;
