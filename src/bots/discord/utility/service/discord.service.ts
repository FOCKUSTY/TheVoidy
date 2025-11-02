import { Client as DiscordClient, EmbedBuilder } from "discord.js";

import sendMessage from "./helpers/send-message.helper";
import Client from "../../discord.bot";

import { Debug } from "@develop";
import { DiscordService } from "@types";

class Discord extends DiscordService {
  private readonly _client: DiscordClient = Client;

  public readonly sendMessage = async (
    channelId: string,
    message: string | EmbedBuilder[]
  ): Promise<{ type: number; text: string }> => {
    if (!this._client) {
      throw Debug.Error("Client is not defined");
    }

    return await sendMessage(this._client, channelId, message);
  };

  public readonly sendMessageToTelegram = async (
    channelId: string,
    message: string,
    telegramName: string
  ): Promise<{ type: number; text: string }> => {
    if (!this._client) {
      throw Debug.Error("Client is not defined");
    }

    try {
      return sendMessage(
        this._client,
        channelId,
        `Отправлено из Telegram от ${telegramName} \n${message}`
      );
    } catch (error) {
      throw Debug.Error(error);
    }
  };

  get client(): DiscordClient {
    return this._client;
  }
}

export default Discord;
