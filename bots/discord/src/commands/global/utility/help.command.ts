import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";

import Command, { DeployCommands } from "types/command.type";

export default new Command({
  data: new SlashCommandBuilder().setName("help").setDescription("Все доступные команды !"),

  async execute(interaction: CommandInteraction, modules) {
    const { commands } = modules.commands.commands;

    return await interaction.reply({
      content: Object.keys(commands)
        .map(
          (key) =>
            `${key}-команды:\n🎩${Array.from((commands as { [key: string]: DeployCommands })[key].keys()).join("\n🎩")}`
        )
        .join("\n\n"),
      flags: MessageFlags.Ephemeral
    });
  }
});
