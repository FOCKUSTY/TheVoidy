import { Env, Logger, Debug, Colors } from "@voidy/develop";
import Command, { DeployCommands } from "types/command.type";

import { REST, Routes } from "discord.js";

import type { Collection, Collection as CommandsCollection } from "discord.js";

import path from "node:path";
import fs from "node:fs";

const fileType: ".ts" | ".js" = Env.env.NODE_ENV === "prod" ? ".js" : ".ts";

class Deployer {
  private readonly _logger: Logger<"Commands"> = new Logger("Commands");
  private readonly _updater: Logger<"Updater"> = new Logger("Updater");
  private readonly _rest: REST = new REST().setToken(Env.env.CLIENT_TOKEN);

  public constructor(public readonly collection: Collection<unknown, unknown>) {};

  public execute() {
    const data = {
      global: [],
      guild: [],
      all: [],
      commands: {
        all: new Map(),
        global: new Map(),
        guild: new Map()
      }
    } as {
      global: Command[]
      guild: Command[]
      all: Command[]
      commands: {
        guild: DeployCommands;
        global: DeployCommands;
        all: DeployCommands
      },
    };

    (<const>["global", "guild"]).forEach(type => {
      const commands = this.ForEachCommands<Command>(type, ({commandPath}) => {
        return require(commandPath).default;
      });

      data[type] = commands;
      data.commands[type] = new Map(commands.map(command => [command.name, command]));
    });

    data.all = [...data.global, ...data.guild]; 
    data.commands.all = new Map([
      ...data.commands.global.entries(),
      ...data.commands.guild.entries()
    ]);

    Array.from(data.commands.all.values()).forEach(command => {
      const options = command.data.options.map(option => option.toJSON().name).join(" | ");
      const maxSpaceLength = 20;
      const spaceLength = maxSpaceLength - command.data.name.length;
      const space = new Array(spaceLength).fill(" ").join("");

      this._logger.execute(`Команда ${command.data.name}${space}${options}`);
    });

    this.update(data.commands);

    return data;
  }

  public readonly update = async (commands: { guild: DeployCommands; global: DeployCommands }) => {
    try {
      this._updater.execute("Начало обновления глобальных (/) команд");
      await this._rest.put(Routes.applicationCommands(Env.get("CLIENT_ID")), {
        body: Array.from(commands.global.values()).map(command => command.data.toJSON())
      });
      this._updater.execute("Успешно обновлены глобальные (/) команды", {
        color: Colors.green
      });
      
      this._updater.execute("Начало обновления (/) команд гильдии");
      await this._rest.put(
        Routes.applicationGuildCommands(Env.get("CLIENT_ID"), Env.get("GUILD_ID")),
        { body: Array.from(commands.guild.values()).map(command => command.data.toJSON()) }
      );
      this._updater.execute("Успешно обновлены (/) команды гильдии", {
        color: Colors.green
      });
    } catch (err) {
      return Debug.Error(err);
    }
  };

  private ForEachCommands<T>(
    type: "guild"|"global",
    func: ({ commandPath, commands, modifierPath }: {commandPath: string, modifierPath: string, commands: string[]}) => T,
  ) {
    return fs.readdirSync(path.join(__dirname, type)).map(folder => {
      const modifierPath = path.join(__dirname, type, folder);

      return fs
        .readdirSync(modifierPath)
        .filter((command: string) => command.endsWith(fileType) && !command.endsWith(".d.ts"))
        .map((commandPath, _index, commands) => {
          return func({commandPath: path.join(modifierPath, commandPath), modifierPath, commands});
        });
    }).flatMap(v => v);
  }
}

export default Deployer;
