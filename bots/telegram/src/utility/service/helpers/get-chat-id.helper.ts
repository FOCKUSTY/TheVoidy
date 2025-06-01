import { Types } from "@voidy/types";

const GetChatId = async (msg: Types.Telegram.Interaction): Promise<number | string> => {
  const chatId = await msg.chat.id;
  const fromId = msg.from?.id;

  if (fromId) return fromId;

  return chatId;
};

export default GetChatId;
