import { Env, Logger, Debug, Colors } from "@develop";
import Command, { DeployCommands } from "@discord/types/command.type";

import { REST, Routes } from "discord.js";

import { Collection } from "discord.js";

import path, { join } from "node:path";
import fs, { readFileSync } from "node:fs";

const fileType: ".ts" | ".js" = Env.env.NODE_ENV === "prod" ? ".js" : ".ts";

class Deployer {
  private readonly _logger = new Logger("Commands");
  private readonly _updater = new Logger("Updater");
  private readonly _rest: REST = new REST().setToken(Env.env.CLIENT_TOKEN);

  public constructor(public readonly collection: Collection<string, Command>) {}

  public execute() {
    const data = {
      collection: this.collection,
      global: [],
      guild: [],
      all: [],
      commands: {
        all: new Map(),
        global: new Map(),
        guild: new Map()
      }
    } as {
      collection: Collection<string, Command>;
      global: Command[];
      guild: Command[];
      all: Command[];
      commands: {
        guild: DeployCommands;
        global: DeployCommands;
        all: DeployCommands;
      };
    };

    (<const>["global", "guild"]).forEach((type) => {
      const commands = this.ForEachCommands<Command>(type, ({ commandPath }) => {
        return require(commandPath).default;
      });

      data[type] = commands;
      data.commands[type] = new Map(commands.map((command) => [command.name, command]));
    });

    data.all = [...data.global, ...data.guild];
    data.all.forEach((command) => {
      data.collection.set(command.name, command);
    });
    data.commands.all = new Map([
      ...data.commands.global.entries(),
      ...data.commands.guild.entries()
    ]);

    Array.from(data.commands.all.values()).forEach((command) => {
      const options = command.data.options.map((option) => option.toJSON().name).join(" | ");
      const maxSpaceLength = 20;
      const spaceLength = maxSpaceLength - command.data.name.length;
      const space = new Array(spaceLength).fill(" ").join("");

      this._logger.execute(`Команда ${command.data.name}${space}${options}`);
    });

    this.update(data.commands);

    return data;
  }

  public find() {
    const data = {
      collection: this.collection,
      global: [],
      guild: [],
      all: [],
      commands: {
        all: new Map(),
        global: new Map(),
        guild: new Map()
      }
    } as {
      collection: Collection<string, Command>;
      global: Command[];
      guild: Command[];
      all: Command[];
      commands: {
        guild: DeployCommands;
        global: DeployCommands;
        all: DeployCommands;
      };
    };

    (<const>["global", "guild"]).forEach((type) => {
      const commands = this.ForEachCommands<Command>(type, ({ commandPath }) => {
        return require(commandPath).default;
      });

      data[type] = commands;
      data.commands[type] = new Map(commands.map((command) => [command.name, command]));
    });

    data.all = [ ...data.global, ...data.guild ];

    return data;
  }

  public readonly update = async (commands: { guild: DeployCommands; global: DeployCommands }) => {
    try {
      const { global, guild } = Deployer.readCommandsFile();

      const globalJson = Object.keys(global)
        .filter((key) => global[key])
        .map((key) => commands.global.get(key)?.data.toJSON());

      this._updater.execute("Начало обновления глобальных (/) команд");
      await this._rest.put(Routes.applicationCommands(Env.env.CLIENT_ID), {
        body: globalJson
      });
      this._updater.execute("Успешно обновлены глобальные (/) команды", {
        color: Colors.green
      });

      const guildJson = Object.keys(guild)
        .filter((key) => guild[key])
        .map((key) => commands.guild.get(key)?.data.toJSON());

      this._updater.execute("Начало обновления (/) команд гильдии");
      await this._rest.put(Routes.applicationGuildCommands(Env.env.CLIENT_ID, Env.env.GUILD_ID), {
        body: guildJson
      });
      this._updater.execute("Успешно обновлены (/) команды гильдии", {
        color: Colors.green
      });
    } catch (err) {
      return Debug.Error(err);
    }
  };

  public static readCommandsFile = (): {
    all: { [key: string]: boolean };
    guild: { [key: string]: boolean };
    global: { [key: string]: boolean };
  } => {
    return JSON.parse(readFileSync(join(__dirname, ".commands"), "utf-8"));
  };

  private ForEachCommands<T>(
    type: "guild" | "global",
    func: ({
      commandPath,
      commands,
      modifierPath
    }: {
      commandPath: string;
      modifierPath: string;
      commands: string[];
    }) => T
  ) {
    return fs
      .readdirSync(path.join(__dirname, type))
      .map((folder) => {
        const modifierPath = path.join(__dirname, type, folder);

        return fs
          .readdirSync(modifierPath)
          .filter((command: string) => command.endsWith(fileType) && !command.endsWith(".d.ts"))
          .map((commandPath, _index, commands) => {
            return func({
              commandPath: path.join(modifierPath, commandPath),
              modifierPath,
              commands
            });
          });
      })
      .flatMap((v) => v);
  }
}

export default Deployer;
