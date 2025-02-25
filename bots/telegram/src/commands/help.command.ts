import { Interaction } from "v@types/telegram/interaction.type";
import TelegramCommand from "v@types/commands/telegram-command.type";

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
