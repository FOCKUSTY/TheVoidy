import { Types } from "v@types";

export default class Command extends Types.Telegram.Command {
  public constructor() {
    super({
      name: "help",
      async execute(interaction: Types.Telegram.Interaction) {
        await interaction.reply("Команда не доработана");
      }
    });
  }
}
