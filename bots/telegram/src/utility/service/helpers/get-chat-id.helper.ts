import { Voidy } from "v@types";

const GetChatId = async (msg: Voidy.Telegram.Interaction): Promise<number | string> => {
  const chatId = await msg.chat.id;
  const fromId = msg.from?.id;

  if (fromId) return fromId;

  return chatId;
};

export default GetChatId;
