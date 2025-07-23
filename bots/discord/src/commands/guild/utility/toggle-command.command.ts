import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import Command from "types/command.type";

import { readFileSync } from "fs";
import { join } from "path";

import CommandsModule, { cache } from "commands/commands.module";

const getCommands = () => {
  return JSON.parse(readFileSync(join(__dirname, "../../.commands"), "utf-8")) as typeof cache;
};

export default new Command({
  data: new SlashCommandBuilder()
    .setName("toggle-command")
    .setDescription("Включить/выключить команду !")
    .addStringOption((o) =>
      o
        .setName("command")
        .setDescription("Команда")
        .setRequired(true)
        .addChoices(
          Object.keys(getCommands().all).map((command) => {
            return { name: command, value: command };
          })
        )
    ),
  async execute(interaction: CommandInteraction, modules) {
    const command = interaction.options.get("command")?.value as string;

    const enabled = CommandsModule.switchCommand(command)[command];

    return interaction
      .reply({
        content: `Команда ${command} ${enabled ? "включена" : "выключена"}`,
        flags: MessageFlags.Ephemeral
      })
      .then(() => {
        modules.commands.deployer.update(modules.commands.commands.commands);
      });
  }
});
