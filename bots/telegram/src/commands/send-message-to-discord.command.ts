import { Interaction } from "@voidy/types/dist/telegram/interaction.type";
import { Option } from "@voidy/types/dist/telegram/options.type";

import { options } from "../events/message.listener";

import TelegramCommand from "@voidy/types/dist/commands/telegram-command.type";

type DefaultOption = Option<string | { type: number; text: string }, string[], string[]>;

export default class Command extends TelegramCommand {
	public constructor(services: {discord: any}) {		
		super({
			name: "send_message_to_discord",
			options: ["channelId", "message"],
			async execute(interaction: Interaction) {
				if (!interaction.from) return;
		
				const replyOptions: DefaultOption[] = [
					{
						command: "send_message_to_discord",
						option: "channelId",
						error: "",
						text: "Введите id канала",
		
						id: interaction.message.message_id + 0
					},
					{
						command: "send_message_to_discord",
						option: "message",
						error: "",
						text: "Введите сообщение",
		
						id: interaction.message.message_id + 2
					},
					{
						command: "send_message_to_discord",
						option: "end",
						error: "Не удалось отправить сообщение в Discord\n\nОшибка:\n%ERROR%",
						text: "Сообщение было отправлено в Discord\n\nСообщение:\n%SUCCESS%",
						function: services.discord.SendMessageToTelegram,
		
						addArgs: [interaction.from.username || interaction.from.first_name],
						id: 0
					}
				];
		
				options.set(interaction.from.id, replyOptions);
		
				await interaction.reply(replyOptions[0].text);
			},
			async executeFunc(interaction: Interaction, userId: number | string) {
				if (!interaction.from) return;
		
				const replyOptions: DefaultOption[] = [
					{
						command: "send_message_to_discord",
						option: "message",
						error: "",
						text: "Введите сообщение",
		
						id: interaction.message.message_id
					},
					{
						command: "send_message_to_discord",
						option: "end",
						error: "Не удалось отправить сообщение в Discord\nОшибка: %ERROR%",
						text: "Сообщение было отправлено в Discord\nСообщение: %SUCCESS%",
						function: services.discord.SendMessageToTelegram,
		
						addArgs: [
							`${userId}`,
							interaction.from.username || interaction.from.first_name
						],
						id: 0
					}
				];
		
				options.set(interaction.from.id, replyOptions);
				await interaction.reply(replyOptions[0].text);
			}
		});
	}
};