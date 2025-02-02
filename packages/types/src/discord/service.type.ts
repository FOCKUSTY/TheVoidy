import { Client as DiscordClient, EmbedBuilder } from "discord.js";
import { Message as TelegramMessage } from "telegraf/typings/core/types/typegram";

import { Response } from "../all/response.type";

export abstract class Service {
	public abstract SendMessage(
		channelId: string,
		message: string | EmbedBuilder[]
	): Promise<string | { type: number; text: string }>;

	public abstract SendMessageToTelegram(
		channelId: string,
		message: string,
		telegramName: string
	): Promise<Response<string | { type: number; text: string }>>;

	abstract get client(): DiscordClient;
}
