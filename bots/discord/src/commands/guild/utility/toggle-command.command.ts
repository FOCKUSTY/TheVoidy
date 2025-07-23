import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import Command from "types/command.type";

import Deployer from "commands/deploy.commands";
import CommandsModule, { data } from "commands/commands.module";

const getCommands = () => {
  return require("../../commands.module") as {
    default: typeof CommandsModule,
    data: typeof data
  };
};

export default new Command({
  data: new SlashCommandBuilder().setName("toggle-command").setDescription("Включить/выключить команду !")
    .addStringOption(o => o
      .setName("command").setDescription("Команда").setRequired(true)
      .addChoices(getCommands().data.all.map(command => { return { name: command.name, value: command.name } }))),
  async execute(interaction: CommandInteraction) {
    const command = interaction.options.get("command")?.value as string;

    const enabled = CommandsModule.switchCommand(command)[command];
    new Deployer(getCommands().data.collection).update(data.commands)

    return interaction.reply({
      content: `Команда ${command} ${enabled ? "включена" : "выключена"}`,
      flags: MessageFlags.Ephemeral
    });
  }
});
