import { Interaction } from "@telegram/types/interaction.type";
import TelegramCommand from "@telegram/types/command.type";

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
