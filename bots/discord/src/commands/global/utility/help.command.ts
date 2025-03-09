import { CommandInteraction, SlashCommandBuilder } from "discord.js";

import commands from "src/index.commads";
import { Voidy } from "v@types";

export default new Voidy.Discord.Command({
  data: new SlashCommandBuilder().setName("help").setDescription("Все доступные команды !"),

  async execute(interaction: CommandInteraction) {
    return await interaction.reply({
      content: `Все команды: \n🎩${commands.join("\n🎩")}`,
      ephemeral: true
    });
  }
});
