import { Collection } from "discord.js";
import path from "path";
import fs from "fs";

import Deployer from "./deploy.commands";

const foldersPath = path.join(__dirname);
const commandsFolder = fs.readdirSync(foldersPath);

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

    const { global, guild } = require("./slash.commands").register();
    const commands = require("./index.commads").default;

    this.write();

    return {
      global,
      guild,
      commands,
      collection: this.commands
    }
  };

  private write() {
    return new Deployer(foldersPath, commandsFolder).write(this.commands)
  }
};

export default CommandsModule;