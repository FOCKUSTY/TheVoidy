import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { Types } from "@voidy/types";

import TeamSubcommands from "subcommands/team";

const subcommandsInitializer = TeamSubcommands();
const { name, subcommands } = subcommandsInitializer;
const { create, del } = subcommands;

export default new Types.Discord.Command({
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription("Управление командой !")
    .addSubcommand(() => create.subcommand)
    .addSubcommand(() => del.subcommand),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      content: "Подготавливаем и создаём...",
      flags: MessageFlags.Ephemeral
    });

    const { data } = await subcommandsInitializer.execute(interaction);

    return await interaction.editReply(`${data}`);
  }
});
