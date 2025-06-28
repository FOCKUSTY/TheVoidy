import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { Types } from "@voidy/types";

import Subcommands from "subcommands/team";

const subcommandsInitializer = new Subcommands();
const { name, subcommands } = subcommandsInitializer;
const { create } = subcommands;

export default new Types.Discord.Command({
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription("Управление командой !")
    .addSubcommand(() => create.subcommand),
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      content: "Подготавливаем и создаём...",
      flags: MessageFlags.Ephemeral
    });

    const { data } = await subcommandsInitializer.execute(interaction);

    return await interaction.editReply(`${data}`);
  }
});
