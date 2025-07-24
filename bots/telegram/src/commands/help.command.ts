import { Interaction } from "types/interaction.type";
import TelegramCommand from "types/command.type";

export default class Command extends TelegramCommand {
  public constructor() {
    super({
      name: "help",
      async execute(interaction: Interaction) {
        await interaction.reply("Команда не доработана");
      }
    });
  }
}
