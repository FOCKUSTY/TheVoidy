import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import RandomActiviy from "utility/service/random-activity.service";
import Command from "types/command.type";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("random-activity")
    .setDescription("Рандомная активность !"),
  async execute(interaction: CommandInteraction) {
    const activity = await new RandomActiviy(interaction.client, "", false).execute();
    const type = activity.type === "custom" ? "" : activity.type;

    return await interaction.reply({
      content: `${type} ${activity.text}`,
      flags: MessageFlags.Ephemeral
    });
  }
});
