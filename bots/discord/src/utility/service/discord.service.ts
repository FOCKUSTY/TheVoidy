import { Client as DiscordClient, EmbedBuilder } from "discord.js";
import { Debug } from "v@develop";

import { Response } from "v@types/all/response.type";
import { Service } from "v@types/discord/service.type";
import SendMessage from "./helpers/send-message.helper";
import Client from "../../discord.bot";

class Discord extends Service {
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
	): Promise<Response<string | { type: number; text: string }>> => {
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
