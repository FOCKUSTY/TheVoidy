import { Debug, Logger } from "v@develop";

import type { Interaction } from "v@types/telegram/interaction.type";
import TelegramCommand from "v@types/commands/telegram-command.type";
import { Services } from "v@types/all/services.type";

import { Telegraf } from "telegraf";
import Commands from "./index.commands";

import path from "node:path";

export const commands = new Map<
  string,
  { execute: (interaction: Interaction) => Promise<void>; options: string[] }
>();

type Command = new (services: Services) => TelegramCommand;

export default class Deployer {
  private readonly _logger = new Logger("Commands");
  private readonly _services: Services;

  public constructor(services: Services) {
    this._services = services;
  }

  public execute(Client: Telegraf, commandsPath: string, commandsFiles: string[]) {
    for (const fileName of commandsFiles) {
      const filePath = path.join(commandsPath, fileName);
      const command: TelegramCommand = new (require(filePath).default as Command)(this._services);

      this._logger.execute(`Telegram команда ${command.name}`);

      if (command.execute && command.name) {
        commands.set(command.name, {
          execute: command.execute,
          options: command.options || undefined
        });

        Commands.commands = command.name;
        Commands.setCommand({
          name: command.name,
          options: command.options || [],
          executeFunc: command.executeFunc,
          execute: command.execute
        });
        Client.command(command.name, async (message: Interaction) => command.execute(message));
      } else
        Debug.Error(
          new Error(`Потерян execute или name в ${command?.name || fileName}\nПуть: ${filePath}`)
        );
    }
  }
}
