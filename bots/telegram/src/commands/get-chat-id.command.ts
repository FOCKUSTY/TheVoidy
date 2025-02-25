import { Interaction } from "v@types/telegram/interaction.type";
import TelegramCommand from "v@types/commands/telegram-command.type";
import { Services } from "v@types/all/services.type";

export default class Command extends TelegramCommand {
  public constructor(services: Services) {
    super({
      name: "get_chat_id",
      async execute(interaction: Interaction) {
        return await interaction.reply(`${(await services.telegram.GetChatId(interaction)).data}`);
      }
    });
  }
}
