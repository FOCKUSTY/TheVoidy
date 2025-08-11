import { Interaction } from "@telegram/types/interaction.type";
import TelegramCommand from "@telegram/types/command.type";
import { Services } from "@types";

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
