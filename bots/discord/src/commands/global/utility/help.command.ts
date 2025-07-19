import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";

import { data } from "commands/commands.module";
import Command, { DeployCommands } from "types/command.type";

export default new Command({
  data: new SlashCommandBuilder().setName("help").setDescription("Все доступные команды !"),

  async execute(interaction: CommandInteraction) {
    return await interaction.reply({
      content: Object.keys(data.commands).map(key => `${key}-команды:\n🎩${Array.from((data.commands as {[key: string]: DeployCommands})[key].keys()).join("\n🎩")}`).join("\n\n"),
      flags: MessageFlags.Ephemeral
    });
  }
});
