import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { Types } from "@voidy/types";

export default new Types.Discord.Command({
  data: new SlashCommandBuilder().setName("test").setDescription("Тестовое сообщение !"),
  async execute(interaction: CommandInteraction) {
    return interaction.reply({
      content: "Test message?...",
      flags: MessageFlags.Ephemeral
    });
  }
});
