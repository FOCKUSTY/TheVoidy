import { Format, Telegraf } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";
import { TelegramInteraction as Interaction } from "../commands/interactions.type";

export abstract class TelegramService {
  public abstract send(
    chatId: number | string,
    message: string | Format.FmtString
  ): Promise<string | Message.TextMessage>;

  public abstract sendMessage(
    chatId: number | string,
    message: string | string[]
  ): Promise<string | Message.TextMessage>;

  public abstract getChatId(message: Interaction): Promise<string>;

  abstract get client(): Telegraf;
}
