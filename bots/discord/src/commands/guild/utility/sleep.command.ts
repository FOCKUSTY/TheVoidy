import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { Types } from "@voidy/types";

import Sleep from "src/utility/service/sleep.service";

const TIMEOUT = 10;

export default new Types.Discord.Command({
  data: new SlashCommandBuilder().setName("sleep").setDescription("Тестовое сообщение !"),
  async execute(interaction: CommandInteraction) {
    interaction.reply({content: `Завершении программы через ${TIMEOUT} секунд.`, flags: MessageFlags.Ephemeral})
    
    new Sleep(TIMEOUT).execute((delay) => {
      interaction.editReply({content:  `Завершении программы через ${delay} секунд.`});
    }).then(() => {
      interaction.editReply({content: "Программа завершена."});
    });
  }
});
