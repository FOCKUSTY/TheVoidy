import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Types } from "v@types";

export default new Types.Discord.Command({
  data: new SlashCommandBuilder().setName("test").setDescription("Тестовое сообщение !"),
  async execute(interaction: CommandInteraction) {
    return await interaction.reply({
      content: "Test message?...",
      fetchReply: true,
      ephemeral: true
    });
  }
});
