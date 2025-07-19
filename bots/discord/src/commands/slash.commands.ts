import Deployer from "./deploy.commands";
import Command from "types/command.type";

import path from "path";
import fs from "fs";

export const global: Command[] = [];
export const guild: Command[] = [];

const foldersPath = path.join(__dirname);
const commandsFolder = fs.readdirSync(foldersPath);

const deployer = new Deployer(foldersPath, commandsFolder);

export const update = () => {
  deployer.update(global, "global");
  deployer.update(guild, "guild");

  return {
    global,
    guild
  };
};

export const register = () => {
  deployer.execute(global, "global");
  deployer.execute(guild, "guild");
  
  update()

  return {
    global,
    guild
  };
}

export default register;
