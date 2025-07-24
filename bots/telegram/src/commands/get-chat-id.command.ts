import { Interaction } from "types/interaction.type";
import TelegramCommand from "types/command.type";

import { Types } from "@voidy/types";

export default class Command extends TelegramCommand {
  public constructor(services: Types.Services) {
    super({
      name: "get_chat_id",
      async execute(interaction: Interaction) {
        return await interaction.reply(`${(await services.telegram.GetChatId(interaction)).data}`);
      }
    });
  }
}
