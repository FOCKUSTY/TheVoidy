import { Voidy } from "v@types";

export default class Command extends Voidy.Telegram.Command {
  public constructor() {
    super({
      name: "help",
      async execute(interaction: Voidy.Telegram.Interaction) {
        await interaction.reply("Команда не доработана");
      }
    });
  }
}
