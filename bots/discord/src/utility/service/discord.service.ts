import { Client as DiscordClient, EmbedBuilder } from "discord.js";
import { Debug } from "@voidy/develop";

import { Types } from "@voidy/types";

import SendMessage from "./helpers/send-message.helper";
import Client from "../../discord.bot";

class Discord extends Types.Discord.Service {
  private readonly _client: DiscordClient = Client;

  public readonly SendMessage = async (
    channelId: string,
    message: string | EmbedBuilder[]
  ): Promise<string | { type: number; text: string }> => {
    if (!this._client) return Debug.Error("Client is not defined");

    return await SendMessage(this._client, channelId, message);
  };

  public readonly SendMessageToTelegram = async (
    channelId: string,
    message: string,
    telegramName: string
  ): Promise<Types.Response<string | { type: number; text: string }>> => {
    if (!this._client)
      return {
        data: Debug.Error("Client is not defined"),
        text: "Client is not defined",
        type: 0
      };

    try {
      return {
        data: await SendMessage(
          this._client,
          channelId,
          `Отправлено из Telegram от ${telegramName} \n${message}`
        ),
        text: "Сообщение успешно отправлено",
        type: 1
      };
    } catch (error) {
      Debug.Error(error);

      return {
        data: `${error}`,
        text: "Сообщение не было отправлено",
        type: 0
      };
    }
  };

  get client(): DiscordClient {
    return this._client;
  }
}

export default Discord;
