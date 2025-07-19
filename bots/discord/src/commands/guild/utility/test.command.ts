import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import Command from "types/command.type";

export default new Command({
  data: new SlashCommandBuilder().setName("test").setDescription("Тестовое сообщение !"),
  async execute(interaction: CommandInteraction) {
    return interaction.reply({
      content: "Test message?...",
      flags: MessageFlags.Ephemeral
    });
  }
});
