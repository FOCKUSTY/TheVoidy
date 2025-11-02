import { Client as DiscordClient, EmbedBuilder } from "discord.js";

export abstract class DiscordService {
  public abstract sendMessage(
    channelId: string,
    message: string | EmbedBuilder[]
  ): Promise<string | { type: number; text: string }>;

  public abstract sendMessageToTelegram(
    channelId: string,
    message: string,
    telegramName: string
  ): Promise<string | { type: number; text: string }>;

  abstract get client(): DiscordClient;
}
