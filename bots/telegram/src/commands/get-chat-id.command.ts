import { Interaction } from "v@types/telegram/interaction.type";
import TelegramCommand from "v@types/commands/telegram-command.type";

export default class Command extends TelegramCommand {
	public constructor(services: { telegram: any }) {
		super({
			name: "get_chat_id",
			async execute(interaction: Interaction) {
				return await interaction.reply(
					`${(await services.telegram.GetChatId(interaction)).data}`
				);
			}
		});
	}
}
