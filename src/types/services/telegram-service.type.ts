import { Format, Telegraf } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";
import { TelegramInteraction as Interaction } from "../commands/interactions.type";

import { Response } from "../base/response.type";
import { FullPresets } from "./news-pattern.type";
import { Commit } from "./github-api";

export abstract class TelegramService {
  public abstract Format({
    repos,
    pattern,
    linkEnabled
  }: {
    repos: { [key: string]: { link: string; commits: Commit[] } };
    pattern: FullPresets;
    linkEnabled: boolean;
  }): string;

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
