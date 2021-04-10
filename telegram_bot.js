const TelegramBot = require("node-telegram-bot-api");
const sh = require("shelljs");
require("dotenv").config();

function getBalanceHandler(_msg) {
  const result = sh.exec("node main.js", { silent: true });
  return result.stdout;
}
function defaultHandler(_msg) {
  return "invalid cmd";
}
const cmdHandler = { p: getBalanceHandler };

function userFilter(msg) {
  const userWhiteList = [process.env.TG_USER];
  if (!userWhiteList.includes(msg.chat.username)) {
    return "invalid user";
  }
  return "";
}
const validators = [userFilter];

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  for (const f of validators) {
    const rtn = f(msg);
    if (rtn != "") {
      bot.sendMessage(chatId, rtn);
      return;
    }
  }
  const handler = cmdHandler[msg.text] || defaultHandler;
  bot.sendMessage(chatId, handler(msg));
});
