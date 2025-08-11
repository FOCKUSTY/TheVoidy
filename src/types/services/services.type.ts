import { TelegramService } from "./telegram-service.type";
import { DiscordService } from "./discord-service.type";
import { Ai } from "./ai-service.type";

export type Services<T extends { [key: string]: unknown } = { [key: string]: unknown }> = {
  discord: DiscordService;
  telegram: TelegramService;
  ai: Ai;
} & T;
