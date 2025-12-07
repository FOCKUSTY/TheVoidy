import { Collection } from "discord.js";
import { join } from "node:path";
import { promises as fs, existsSync } from "node:fs";

import Deployer from "./deploy.commands";
import Command, { DeployCommands } from "@discord/types/command.type";

export let data: {
  collection: Collection<string, Command>;
  global: Command[];
  guild: Command[];
  all: Command[];
  commands: {
    guild: DeployCommands;
    global: DeployCommands;
    all: DeployCommands;
  };
} = {
  collection: new Collection(),
  global: [],
  guild: [],
  all: [],
  commands: {
    all: new Map(),
    global: new Map(),
    guild: new Map()
  }
};

export let cache: {
  all: { [key: string]: boolean };
  guild: { [key: string]: boolean };
  global: { [key: string]: boolean };
} = {
  all: {},
  global: {},
  guild: {}
};

const initCommandsFile = async () => {
  const commandsPath = join(__dirname, ".commands");
  const content = existsSync(commandsPath)
    ? await fs.readFile(commandsPath, "utf-8")
    : JSON.stringify(cache, undefined, 2);

  await fs.writeFile(commandsPath, content, "utf-8");
};

initCommandsFile().catch(console.error);

export class CommandsModule {
  public readonly name = "commands" as const;
  public readonly deployer: Deployer;
  public commands: typeof data = data;

  public constructor(
    public readonly actived: boolean = true,
    public readonly commandsCollection: Collection<string, Command>
  ) {
    this.deployer = new Deployer(commandsCollection);
  }

  public async execute() {
    if (!this.actived) {
      return false as const;
    }

    const foundCommands = await this.deployer.find();
    await CommandsModule.toJson(foundCommands);

    const executedCommands = await this.deployer.execute();
    this.commands = executedCommands;
    data = this.commands;

    await this.deployer.update(this.commands.commands);

    return this;
  }

  public static async toJson(commands: { global: Command[]; guild: Command[]; all: Command[] }) {
    cache = Object.fromEntries(
      ["guild", "global", "all"].map((key) => [
        key,
        Object.fromEntries(
          (commands as { [key: string]: Command[] })[key].map((command) => [
            command.name,
            command.actived
          ])
        )
      ])
    ) as {
      all: { [key: string]: boolean };
      guild: { [key: string]: boolean };
      global: { [key: string]: boolean };
    };

    const commandsPath = join(__dirname, ".commands");
    await fs.writeFile(commandsPath, JSON.stringify(cache, undefined, 2), "utf-8");

    return cache;
  }

  public static async switchCommand(commandName: string): Promise<{ [key: string]: boolean }> {
    cache.all[commandName] = !cache.all[commandName];
    if (cache.global[commandName] !== undefined)
      cache.global[commandName] = !cache.global[commandName];
    else cache.guild[commandName] = !cache.guild[commandName];

    const commandsPath = join(__dirname, ".commands");
    await fs.writeFile(commandsPath, JSON.stringify(cache, undefined, 2), "utf-8");

    return cache.all;
  }
}

export default CommandsModule;
