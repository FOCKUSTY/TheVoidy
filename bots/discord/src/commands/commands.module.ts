import { Collection } from "discord.js";
import path from "path";
import fs from "fs";

import Deployer from "./deploy.commands";
import Command, { DeployCommands } from "src/types/command.type";

export let data = {
  collection: new Collection(),
  global: [],
  guild: [],
  all: [],
  commands: {
    all: new Map(),
    global: new Map(),
    guild: new Map()
  }
} as {
  collection: Collection<unknown, unknown>,
  global: Command[];
  guild: Command[];
  all: Command[];
  commands: {
    guild: DeployCommands;
    global: DeployCommands;
    all: DeployCommands;
  };
};

let cache: {
  all: { [key: string]: boolean },
  guild: { [key: string]: boolean },
  global: { [key: string]: boolean }
} = {
  all: {},
  global: {},
  guild: {}
};

export class CommandsModule {
  public readonly name = "commands" as const;

  public constructor(
    public readonly actived: boolean = true,
    public readonly commands: Collection<unknown, unknown>
  ) {}

  public execute() {
    if (!this.actived) {
      return false as const;
    }

    const commands = new Deployer(this.commands).execute();
    
    data = commands;
    
    CommandsModule.toJson(commands);

    return commands;
  }

  public static toJson(commands: { global: Command[]; guild: Command[]; all: Command[] }) {
    cache = Object.fromEntries(["guild", "global", "all"].map(key => [key, Object.fromEntries((commands as {[key: string]: Command[]})[key].map(command => [command.name, command.actived]))])) as {
      all: { [key: string]: boolean },
      guild: { [key: string]: boolean },
      global: { [key: string]: boolean }
    };
    
    fs.writeFileSync(
      path.join(__dirname, ".commands"),
      JSON.stringify(cache, undefined, 2),
      "utf-8"
    );

    return cache;
  }

  public static switchCommand(commandName: string) {
    cache.all[commandName] = !cache.all[commandName];

    fs.writeFileSync(
      path.join(__dirname, ".commands"),
      JSON.stringify(cache, undefined, 2),
      "utf-8"
    );

    return cache.all;
  };
}

export default CommandsModule;
