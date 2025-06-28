import { Logger } from "@voidy/develop";
import { Subcommand } from "@voidy/types/dist/commands/discord-command.type";

import { readdirSync } from "node:fs";
import { join } from "node:path";
import { Response } from "./constants";

const EXTENTION = process.env.NODE_ENV === "prod" ? "js" : "ts";
const REG_EXP = new RegExp(`[\\w\\W]+\\.subcommand\\.${EXTENTION}`);

export class SubcommandsDeployer {
  private readonly logger = new Logger("Commands");
  
  public execute(name: string) {
    return Object.fromEntries(readdirSync(join(__dirname)).filter(file => 
      REG_EXP.test(file)).map(file => {
        const subcommand = require(join(__dirname, file)).default as typeof Subcommand<Response>;
        this.logger.execute(`Субкоманда ${name.toLowerCase()}>${subcommand.name}`)
        return subcommand;
      }).map(subcommand => [subcommand.name.toLowerCase(), subcommand])) as {[key: string]: typeof Subcommand<Response>};
  };
}

export default SubcommandsDeployer;
