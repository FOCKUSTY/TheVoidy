import type { TelegramInteraction } from "@types";

import { TelegramService } from "@types";
import { Format } from "telegraf";

import { client } from "../../telegram.bot";

export class Telegram extends TelegramService {
  public readonly client = client;

  public send(
    chatId: number | string,
    message: string | Format.FmtString
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }

  public sendMessage(
    chatId: number | string,
    message: string | string[]
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }

  public getChatId(message: TelegramInteraction): Promise<string> {
    throw new Error("Method not implemented.");
  }
};

export default Telegram;
