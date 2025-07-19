import { Env } from "@voidy/develop";

import Command, { DeployCommands } from "types/command.type";
import path from "path";
import fs from "fs";

const commands: DeployCommands = new Map();

const foldersPath = path.join(__dirname);
const commandsFolder = fs.readdirSync(foldersPath);

const fileType: ".ts" | ".js" = Env.env.NODE_ENV === "prod" ? ".js" : ".ts";

for (const placeFolder of commandsFolder) {
  const commandsPath = path.join(foldersPath, placeFolder);
  try {
    const commandsFiles = fs.readdirSync(commandsPath);
  
    for (const folder of commandsFiles) {
      const modifierPath = path.join(commandsPath, folder);
      const files = fs
        .readdirSync(modifierPath)
        .filter((file: string) => file.endsWith(fileType) && !file.endsWith(".d.ts"));
  
      for (const file of files) {
        const filePath = path.join(modifierPath, file);
        const command: Command = require(path.resolve(filePath)).default;
  
        if (command && command.data && !!command.execute) commands.set(command.data.name, command);
      };
    };
  } catch {
    continue;
  }
};

export default commands;
