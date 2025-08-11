import { Telegraf } from "telegraf";

const SendMessage = async (Client: Telegraf, chatId: number | string, msg: string | string[]) => {
  let text: string = "";

  if (Array.isArray(msg)) for (const message of msg) text += `\n${message}`;
  else text = msg;

  return await Client.telegram.sendMessage(chatId, text);
};

export default SendMessage;
