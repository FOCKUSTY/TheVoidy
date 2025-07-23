import { Collection } from "discord.js";
import path from "path";
import fs from "fs";

import Deployer from "./deploy.commands";
import Command, { DeployCommands } from "src/types/command.type";

export const data = {
  global: [],
  guild: [],
  all: [],
  commands: {
    all: new Map(),
    global: new Map(),
    guild: new Map()
  }
} as {
  global: Command[];
  guild: Command[];
  all: Command[];
  commands: {
    guild: DeployCommands;
    global: DeployCommands;
    all: DeployCommands;
  };
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

    return new Deployer(this.commands).execute();
  }

  public toJson(commands: { guild: DeployCommands; global: DeployCommands }) {
    fs.writeFileSync(
      path.join(__dirname, "commands.json"),
      JSON.stringify(
        Object.fromEntries(
          Object.keys(commands).map((key) => [
            key,
            Object.fromEntries(
              Array.from((commands as { [key: string]: DeployCommands })[key].values()).map(
                (command) => [command.name, command.actived]
              )
            )
          ])
        )
      ),
      "utf-8"
    );
  }
}

export default CommandsModule;
