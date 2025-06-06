import { Env } from "@voidy/develop";

import { Types } from "@voidy/types";
import path from "path";
import fs from "fs";

const commands: string[] = [];

const foldersPath = path.join(__dirname, "commands");
const commandsFolder = fs.readdirSync(foldersPath);

const fileType: ".ts" | ".js" = Env.env.NODE_ENV === "prod" ? ".js" : ".ts";

for (const placeFolder of commandsFolder) {
  const commandsPath = path.join(foldersPath, placeFolder);
  const commandsFiles = fs.readdirSync(commandsPath);

  for (const folder of commandsFiles) {
    const modifierPath = path.join(commandsPath, folder);
    const files = fs
      .readdirSync(modifierPath)
      .filter((file: string) => file.endsWith(fileType) && !file.endsWith(".d.ts"));

    for (const file of files) {
      const filePath = path.join(modifierPath, file);
      const command: Types.Discord.Command = require(
        path.toNamespacedPath(filePath).replace("\\\\?\\", "")
      ).default;

      if (!!command && !!command.data && !!command.execute) commands.push(command.data.name);
    }
  }
}

export default commands;
