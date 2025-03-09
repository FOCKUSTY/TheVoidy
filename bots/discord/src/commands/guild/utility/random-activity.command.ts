import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import RandomActiviy from "utility/service/random-activity.service";
import { Voidy } from "v@types";

export default new Voidy.Discord.Command({
  data: new SlashCommandBuilder()
    .setName("random-activity")
    .setDescription("Рандомная активность !"),
  async execute(interaction: CommandInteraction) {
    const activity = await new RandomActiviy(interaction.client, "", false).execute();
    const type = activity.type === "custom" ? "" : activity.type;

    return await interaction.reply({
      content: `${type} ${activity.text}`,
      ephemeral: true
    });
  }
});
