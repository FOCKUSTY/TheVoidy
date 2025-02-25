import { CommandInteraction, SlashCommandBuilder } from "discord.js";

import commands from "../../../index.commads";
import Command from "v@types/commands/discord-command.type";

export default new Command({
  data: new SlashCommandBuilder().setName("help").setDescription("Все доступные команды !"),

  async execute(interaction: CommandInteraction) {
    return await interaction.reply({
      content: `Все команды: \n🎩${commands.join("\n🎩")}`,
      ephemeral: true
    });
  }
});
