import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";

import commands from "src/commands/index.commads";
import Command from "types/command.type";

export default new Command({
  data: new SlashCommandBuilder().setName("help").setDescription("Все доступные команды !"),

  async execute(interaction: CommandInteraction) {
    return await interaction.reply({
      content: `Все команды: \n🎩${Array.from(commands.keys()).join("\n🎩")}`,
      flags: MessageFlags.Ephemeral
    });
  }
});
