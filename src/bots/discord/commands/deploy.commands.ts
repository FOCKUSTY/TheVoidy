import { env, Logger, Debug, Colors } from "@develop";
import Command, { DeployCommands } from "@discord/types/command.type";
import { REST, Routes, Collection } from "discord.js";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { FilesLoader } from "@utility/services/loaders/files.loader";

const COMMAND_TYPES = ["global", "guild"] as const;
const FILE_EXTENSIONS = {
  TYPESCRIPT_DEFINITION: ".d.ts",
  COMMANDS_FILE: ".commands"
} as const;
const LOGGER_TYPES = {
  COMMANDS: "Commands",
  UPDATER: "Updater"
} as const;
const UPDATE_MESSAGES = {
  GLOBAL: {
    START: "Начало обновления глобальных (/) команд",
    SUCCESS: "Успешно обновлены глобальные (/) команды"
  },
  GUILD: {
    START: "Начало обновления (/) команд гильдии",
    SUCCESS: "Успешно обновлены (/) команды гильдии"
  }
} as const;

interface CommandsData {
  collection: Collection<string, Command>;
  global: Command[];
  guild: Command[];
  all: Command[];
  commands: {
    guild: DeployCommands;
    global: DeployCommands;
    all: DeployCommands;
  };
}

interface CommandsFileData {
  all: { [key: string]: boolean };
  guild: { [key: string]: boolean };
  global: { [key: string]: boolean };
}

type Callback<T> = (path: string, file: { default: Command }) => Command<T>;

class Deployer {
  private readonly _logger = new Logger(LOGGER_TYPES.COMMANDS);
  private readonly _updater = new Logger(LOGGER_TYPES.UPDATER);
  private readonly _rest: REST = new REST().setToken(env.CLIENT_TOKEN);

  public constructor(public readonly collection: Collection<string, Command>) {}

  public async execute() {
    const data: CommandsData = {
      collection: this.collection,
      global: [],
      guild: [],
      all: [],
      commands: {
        all: new Map(),
        global: new Map(),
        guild: new Map()
      }
    };

    for (const type of COMMAND_TYPES) {
      const commandsList = await this.ForEachCommands<void>(type, (path) => {
        return require(path).default;
      });

      data[type] = commandsList;
      data.commands[type] = new Map(commandsList.map((command) => [command.name, command]));
    };

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

    return data;
  }

  public async find() {
    const data: CommandsData = {
      collection: this.collection,
      global: [],
      guild: [],
      all: [],
      commands: {
        all: new Map(),
        global: new Map(),
        guild: new Map()
      }
    };

    for (const type of COMMAND_TYPES) {
      const commandsList = await this.ForEachCommands<void>(type, (path) => {
        return require(path).default;
      });

      data[type] = commandsList;
      data.commands[type] = new Map(commandsList.map((command) => [command.name, command]));
    };

    data.all = [...data.global, ...data.guild];

    return data;
  }

  public readonly update = async (commands: { guild: DeployCommands; global: DeployCommands }) => {
    try {
      const { global, guild } = Deployer.readCommandsFile();

      const globalJson = Object.keys(global)
        .filter((key) => global[key])
        .map((key) => commands.global.get(key)?.data.toJSON());

      this._updater.execute(UPDATE_MESSAGES.GLOBAL.START);
      await this._rest.put(Routes.applicationCommands(env.CLIENT_ID), {
        body: globalJson
      });
      this._updater.execute(UPDATE_MESSAGES.GLOBAL.SUCCESS, {
        color: Colors.green
      });

      const guildJson = Object.keys(guild)
        .filter((key) => guild[key])
        .map((key) => commands.guild.get(key)?.data.toJSON());

      this._updater.execute(UPDATE_MESSAGES.GUILD.START);
      await this._rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID), {
        body: guildJson
      });
      this._updater.execute(UPDATE_MESSAGES.GUILD.SUCCESS, {
        color: Colors.green
      });
    } catch (err) {
      return Debug.Error(err);
    }
  };

  public static readCommandsFile = (): CommandsFileData => {
    return JSON.parse(readFileSync(join(__dirname, FILE_EXTENSIONS.COMMANDS_FILE), "utf-8"));
  };

  private async ForEachCommands<T>(
    type: "guild" | "global",
    callback: Callback<T>
  ): Promise<Command<T>[]> {
    const typeDir = join(__dirname, type);
    const loader = new FilesLoader<{ default: Command }>(typeDir);
    const commands = await loader.execute(callback, (path) => {
      const commandFileValided = path.endsWith(`.${env.FILE_TYPE}`) && !path.endsWith(FILE_EXTENSIONS.TYPESCRIPT_DEFINITION);
      return !commandFileValided;
    });

    return commands;
  }
}

export default Deployer;
