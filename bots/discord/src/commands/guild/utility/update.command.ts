import { Env } from "v@develop";

import {
	SlashCommandBuilder,
	ModalActionRowComponentBuilder,
	CommandInteraction,
	TextInputBuilder,
	TextInputStyle,
	ModalBuilder,
	ActionRowBuilder
} from "discord.js";

import CustomIds from "v@services/modal/custom-ids.modal";
import Command from "v@types/commands/discord-command.type";

const customIds = CustomIds.getIds();

export default new Command({
	data: new SlashCommandBuilder()
		.setName("update")
		.setDescription("Сообщение с помощью бота!"),
	async execute(interaction: CommandInteraction) {
		if (interaction.user.id !== Env.get("AUTHOR_ID"))
			return await interaction.reply({
				content: "У Вас нет прав на использование этой команды",
				ephemeral: true
			});

		const components = customIds.updateModal.components;
		const modal = new ModalBuilder()
			.setCustomId(customIds.updateModal.id)
			.setTitle("Впишите обновления");

		modal.addComponents(
			new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId(components.ruText)
					.setLabel("Русский")
					.setStyle(TextInputStyle.Paragraph)
					.setRequired(true)
					.setMaxLength(3900)
			),
			new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId(components.enText)
					.setLabel("Английский")
					.setStyle(TextInputStyle.Paragraph)
					.setRequired(true)
					.setMaxLength(3900)
			),
			new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
				new TextInputBuilder()
					.setCustomId(components.version)
					.setLabel("Версия")
					.setStyle(TextInputStyle.Short)
					.setRequired(true)
					.setMaxLength(30)
			)
		);

		await interaction.showModal(modal);
	}
});
