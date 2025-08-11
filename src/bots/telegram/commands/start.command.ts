import Commands from "../index.commands";

import { Interaction } from "@telegram/types/interaction.type";
import TelegramCommand from "@telegram/types/command.type";

export default class Command extends TelegramCommand {
  public constructor() {
    super({
      name: "start",
      async execute(interaction: Interaction) {
        const reply = `Привет, вот мои команды:\n${Commands.commands.join("\n")}\nЧтобы узнать больше, можете воспользоваться /help`;

        if (!interaction.text?.includes("-")) return await interaction.reply(reply);

        const first = interaction.text.split("-");
        const commandName = first[0].split(" ")[1];
        const options: string[] = [commandName, ...first.filter((o) => o !== first[0])];

        if (!Commands.commands.includes(options[0])) return await interaction.reply(reply);

        const command = Commands.fullCommands.filter((a) => a.name === options[0])[0];

        if (!command.executeFunc) return await interaction.reply(reply);

        const funcOptions = options.filter((o) => o !== options[0]);

        command.executeFunc(interaction, ...funcOptions);
      }
    });
  }
}
