import Command from "types/command.type";

import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { Random } from "random-js";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("Случайный выбор чисел !")
    .addIntegerOption((option) =>
      option.setName("min").setDescription("Первое число").setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName("max").setDescription("Второе число").setRequired(true)
    ),

  async execute(interaction: CommandInteraction) {
    const min: number = Number(interaction.options.get("min")?.value || 0);
    const max: number = Number(interaction.options.get("max")?.value || 0);

    if (min === max)
      return await interaction.reply({
        content: "Ваши числа одинаковые",
        flags: MessageFlags.Ephemeral
      });

    await interaction.reply({
      content: `Выбираю между: ${min} & ${max}`,
      flags: MessageFlags.Ephemeral
    });

    const number = new Random().integer(min, max);

    setTimeout(async () => {
      await interaction.editReply({ content: `Ваше число ${number}` });
    }, 1000);
  }
});
