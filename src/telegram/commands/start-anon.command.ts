import { Interaction } from "types/telegram/interaction.type";

export = {
	name: "start_anonimus",
	async execute(interaction: Interaction) {
		const link = "https://t.me/TheVoid_VBOT?start=send_anonimus_message-";

		if (!interaction.from?.id)
			return await interaction.reply("Произошла какая-то ошибка");

		const intro = "Спасибо, что пользуетесь The Void !";
		const main = "Ваша ссылка:\n" + link + interaction.from.id;
		const conc =
			"Отправляйте эту ссылку в группу с вашими друзьями, пусть они будут писать вам анонимные сообщения !";

		await interaction.reply(intro + "\n\n" + main + "\n\n" + conc);
	}
};
