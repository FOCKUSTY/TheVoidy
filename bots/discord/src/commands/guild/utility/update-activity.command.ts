import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { loaders } from "@thevoidcommunity/the-void-database";
import { Types } from "@voidy/types";

const { ActivitiesLoader } = loaders;

export default new Types.Discord.Command({
  data: new SlashCommandBuilder()
    .setName("update-activity")
    .setDescription("Принудительное обновление активностей !")
    .setNameLocalizations({ ru: "обновить-активности", "en-US": "update-activity" })
    .setDescriptionLocalizations({
      ru: "Принудительное обновление активностей",
      "en-US": "Forced update of activities"
    }),
  async execute(interaction: CommandInteraction) {
    try {
      new ActivitiesLoader().reload();

      return interaction.reply({
        content: "Активности были успешно обновлены",
        flags: MessageFlags.Ephemeral
      });
    } catch (err) {
      return interaction.reply({
        content: "Произошла какая-то ошибка" + `${err}`,
        flags: MessageFlags.Ephemeral
      });
    }
  }
});
