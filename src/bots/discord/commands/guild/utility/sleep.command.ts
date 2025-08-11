import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import Command from "@discord/types/command.type";

import Formatter from "f-formatter";

import Sleep from "@discord/utility/service/sleep.service";

const formatter = new Formatter();
const format = (seconds: number) => formatter.RuWords(seconds, ["секунду", "секунды", "секунд"]);
const TIMEOUT = 10;

export default new Command({
  data: new SlashCommandBuilder().setName("sleep").setDescription("Тестовое сообщение !"),
  async execute(interaction: CommandInteraction) {
    interaction.reply({
      content: `Завершении программы через ${TIMEOUT} секунд.`,
      flags: MessageFlags.Ephemeral
    });

    new Sleep(TIMEOUT)
      .execute((delay) => {
        interaction.editReply({ content: `Завершении программы через ${delay} ${format(delay)}.` });
      })
      .then(() => {
        interaction.editReply({ content: "Программа завершена." });
      });
  }
});
