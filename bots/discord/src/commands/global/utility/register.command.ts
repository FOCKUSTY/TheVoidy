import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";

import commands from "src/index.commads";
import { Types } from "@voidy/types";

import RegisterSubcommands from "subcommands/register"

const subcommandsInitializer = RegisterSubcommands();
const { name, subcommands } = subcommandsInitializer;

export default new Types.Discord.Command({
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription("Регистрация сервисов !")
    .addSubcommand(() => subcommands.guild.subcommand),

  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      content: `Подготавливаем...`,
      flags: MessageFlags.Ephemeral
    });

    const { data } = await subcommandsInitializer.execute(interaction);
    
    return await interaction.editReply(`${data}`);
  }
});
