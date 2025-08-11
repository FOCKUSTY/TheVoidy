import { Collection } from "discord.js";
import path from "path";
import fs from "fs";

import Deployer from "./deploy.commands";
import Command, { DeployCommands } from "@discord/types/command.type";

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

export let cache: {
  all: { [key: string]: boolean };
  guild: { [key: string]: boolean };
  global: { [key: string]: boolean };
} = {
  all: {},
  global: {},
  guild: {}
};

fs.writeFileSync(
  path.join(__dirname, ".commands"),
  fs.existsSync(path.join(__dirname, ".commands"))
    ? fs.readFileSync(path.join(__dirname, ".commands"))
    : JSON.stringify(cache, undefined, 2),
  "utf-8"
);

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

  public execute() {
    if (!this.actived) {
      return false as const;
    }

    CommandsModule.toJson(this.deployer.find());
    this.commands = this.deployer.execute();
    data = this.commands;

    this.deployer.update(this.commands.commands);

    return this;
  }

  public static toJson(commands: { global: Command[]; guild: Command[]; all: Command[] }) {
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

    fs.writeFileSync(
      path.join(__dirname, ".commands"),
      JSON.stringify(cache, undefined, 2),
      "utf-8"
    );

    return cache;
  }

  public static switchCommand(commandName: string) {
    cache.all[commandName] = !cache.all[commandName];
    if (cache.global[commandName] !== undefined)
      cache.global[commandName] = !cache.global[commandName];
    else cache.guild[commandName] = !cache.guild[commandName];

    fs.writeFileSync(
      path.join(__dirname, ".commands"),
      JSON.stringify(cache, undefined, 2),
      "utf-8"
    );

    return cache.all;
  }
}

export default CommandsModule;
