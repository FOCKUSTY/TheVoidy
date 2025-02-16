import Command from "@voidy/types/dist/commands/discord-command.type";

import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Random } from "random-js";

export default new Command({
	data: new SlashCommandBuilder()
		.setName("8ball")
		.setDescription("Предсказание будущего !")
		.setNameLocalizations({ ru: "шар", "en-US": "8ball" })
		.setDescriptionLocalizations({
			ru: "Предсказание будущего",
			"en-US": "Predicting the future"
		})
		.addStringOption((option) =>
			option
				.setName("question")
				.setDescription("Ваш вопрос")
				.setRequired(true)
				.setNameLocalizations({ ru: "вопрос", "en-US": "question" })
				.setDescriptionLocalizations({
					ru: "Ваш вопрос",
					"en-US": "Your question"
				})
		),

	async execute(interaction: CommandInteraction) {
		await interaction.reply({ content: `Предсказываю...`, ephemeral: true });

		const categoryes = [
			[
				"Бесспорно",
				"Это было предрешено",
				"Никаких сомнений",
				"Определённо да",
				"Можешь быть уверен в этом",
				"Думаю да...",
				"Наверное...",
				"Хорошие перспективы",
				"Знаки говорят да...",
				"Да"
			],

			[
				"Звезд на небе не видно, попробуй позже",
				"Спроси позже",
				"Лучше не рассказывать",
				"Погода для предсказывание плохая",
				"Сконцентрируйся и спроси опять"
			],

			[
				"Даже не думай",
				"Мой ответ нет",
				"По моим данным нет",
				"Перспективы не очень хорошие"
			]
		];

		const rCategory = new Random().integer(0, categoryes.length - 1);
		const rNum = new Random().integer(0, categoryes[rCategory].length - 1);
		const text = categoryes[rCategory][rNum];

		const question = interaction.options.get("question")?.value;

		setTimeout(async () => {
			await interaction.editReply({
				content: `Ваш вопрос: ${question}\nМой ответ: ${text}`
			});
		}, 1000);
	}
});
