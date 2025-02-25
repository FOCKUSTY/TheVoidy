import Deployer from "./deploy.commands";
import { Command } from "./command.commands";

import path from "path";
import fs from "fs";

const globalCommands: Command[] = [];
const guildCommands: Command[] = [];

const foldersPath = path.join(__dirname, "commands");
const commandsFolder = fs.readdirSync(foldersPath);

const deployer = new Deployer(foldersPath, commandsFolder);

deployer.execute(globalCommands, "global");
deployer.execute(guildCommands, "guild");

deployer.update(globalCommands, "global");
deployer.update(guildCommands, "guild");

export = {
  global: globalCommands,
  guild: guildCommands
};
