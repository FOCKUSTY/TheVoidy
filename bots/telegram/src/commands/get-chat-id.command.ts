import { Types } from "v@types";

export default class Command extends Types.Telegram.Command {
  public constructor(services: Types.Services) {
    super({
      name: "get_chat_id",
      async execute(interaction: Types.Telegram.Interaction) {
        return await interaction.reply(`${(await services.telegram.GetChatId(interaction)).data}`);
      }
    });
  }
}
