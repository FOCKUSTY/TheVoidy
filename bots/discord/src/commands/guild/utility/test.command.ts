import Command from "v@types/commands/discord-command.type";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default new Command({
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("Тестовое сообщение !"),
	async execute(interaction: CommandInteraction) {
		return await interaction.reply({
			content: "Test message?...",
			fetchReply: true,
			ephemeral: true
		});
	}
});
