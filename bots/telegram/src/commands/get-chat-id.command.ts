import { Voidy } from "v@types";

export default class Command extends Voidy.Telegram.Command {
  public constructor(services: Voidy.Services) {
    super({
      name: "get_chat_id",
      async execute(interaction: Voidy.Telegram.Interaction) {
        return await interaction.reply(`${(await services.telegram.GetChatId(interaction)).data}`);
      }
    });
  }
}
