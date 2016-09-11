function defaultController(bot, message) {
  const text = message.text;
  return bot.reply(message, `${text} to you buddy`);
}


export {defaultController};
