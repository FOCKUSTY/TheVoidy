import type { Interaction } from "v@types/telegram/interaction.type";
import { Response } from "v@types/all/response.type";
import { Debug } from "v@develop";

import { Service } from "v@types/telegram/service.type";
import { Telegraf, Format } from "telegraf";

import { Message } from "telegraf/typings/core/types/typegram";

import SendMessage from "./helpers/send-message.helper";
import GetChatId from "./helpers/get-chat-id.helper";

import Client from "../../telegram.bot";

class Telegram extends Service {
	private readonly _client: Telegraf = Client;

	public Send = async (
		chatId: number | string,
		message: string | Format.FmtString
	): Promise<Response<string | Message.TextMessage>> => {
		if (!this._client) {
			return {
				data: Debug.Error("Client is not defined"),
				text: "Client is not defined",
				type: 0
			};
		}

		try {
			return {
				data: await Client.telegram.sendMessage(chatId, message),
				text: "Сообщение было отправлено",
				type: 1
			};
		} catch (error) {
			Debug.Error(error);

			return {
				data: error as string,
				text: "Не удалось отправить сообщение",
				type: 0
			};
		}
	};

	public SendAnonMessage = async (
		chatId: string,
		message: string | string[],
		userId: string
	): Promise<
		Response<
			| string
			| undefined
			| { text: string; data: Message.TextMessage; userId: string | number }
		>
	> => {
		if (!this._client) {
			return {
				data: Debug.Error("Client is not defined"),
				text: "Client is not defined",
				type: 0
			};
		}

		if (chatId === userId)
			return {
				data: undefined,
				text: "Вы не можете отправить сообщение самому себе",
				type: 0
			};

		const link = `https://t.me/TheVoid_VBOT?start=send_anonimus_message-${chatId}`;
		const intro = "Спасибо, что пользуетесь The Void !";
		const main = "Вы можете ответить, но только один раз !";
		const conc = `Вы можете получать анонимные сообщение по ссылке:\n${link}`;

		let text: string = "";

		if (Array.isArray(message)) for (const msg of message) text += `\n${msg}`;
		else text = message;

		try {
			const txt = Format.code(`${intro}\n\n${text}\n\n${main}\n${conc}`);

			if (txt.entities)
				txt.entities[0] = {
					offset: intro.length + 2,
					length: text.length,
					type: "code"
				};

			const data = await Client.telegram.sendMessage(`${chatId}`, txt);

			return {
				data: { text, data, userId },
				text: "Сообщение успешно отправлено",
				type: 1
			};
		} catch (error) {
			return {
				data: error as string,
				text: "Сообщение не было доставлено",
				type: 0
			};
		}
	};

	public SendMessage = async (
		chatId: number | string,
		message: string | string[]
	): Promise<Response<string | Message.TextMessage>> => {
		if (!this._client) {
			return {
				data: Debug.Error("Client is not defined"),
				text: "Client is not defined",
				type: 0
			};
		}

		return {
			data: await SendMessage(this._client, chatId, message),
			text: "Сообщение успешно отправлено",
			type: 1
		};
	};

	public GetChatId = async (
		message: Interaction
	): Promise<Response<string | number>> => {
		return {
			data: await GetChatId(message),
			text: "Сообщение успешно отправлено",
			type: 1
		};
	};

	get client(): Telegraf {
		return this._client;
	}
}

export default Telegram;
