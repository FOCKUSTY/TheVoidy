import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";

import Command from "@discord/types/command.type";

import RegisterSubcommands from "@discord/subcommands/register";

const subcommandsInitializer = RegisterSubcommands();
const { name, subcommands } = subcommandsInitializer;

export default new Command({
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
