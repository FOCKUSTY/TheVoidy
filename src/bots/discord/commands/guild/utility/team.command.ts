import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import Command from "@discord/types/command.type";

import TeamSubcommands from "@discord/subcommands/team";

const subcommandsInitializer = TeamSubcommands();
const { name, subcommands } = subcommandsInitializer;

export default new Command({
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription("Управление командой !")
    .addSubcommand(() => subcommands.create.subcommand)
    .addSubcommand(() => subcommands.delete.subcommand),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      content: "Подготавливаем и создаём...",
      flags: MessageFlags.Ephemeral
    });

    const { data } = await subcommandsInitializer.execute(interaction);

    return await interaction.editReply(`${data}`);
  }
});
