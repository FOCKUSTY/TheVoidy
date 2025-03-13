import { Format, Telegraf } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";

import { Response } from "../base/response.type";
import { TelegramInteraction as Interaction } from "../commands/interactions.type";

import { CreateService as CreatePatternService } from "./pattern-formatting-service.type";
import { FmtString } from "telegraf/typings/format";

export abstract class Service {
  public readonly pattern: CreatePatternService<FmtString<string>>;

  public abstract Send(
    chatId: number | string,
    message: string | Format.FmtString
  ): Promise<Response<string | Message.TextMessage>>;

  public abstract SendAnonMessage(
    chatId: string,
    message: string | string[],
    userId: string
  ): Promise<
    Response<
      string | undefined | { text: string; data: Message.TextMessage; userId: string | number }
    >
  >;

  public abstract SendMessage(
    chatId: number | string,
    message: string | string[]
  ): Promise<Response<string | Message.TextMessage>>;

  public abstract GetChatId(message: Interaction): Promise<Response<string | number>>;

  abstract get client(): Telegraf;
}