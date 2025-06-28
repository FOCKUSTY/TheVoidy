import { Logger } from "@voidy/develop";
import { Subcommand, SubcommandsInitializer } from "@voidy/types/dist/commands/discord-command.type";

import { readdirSync } from "node:fs";
import { join } from "node:path";
import { Response } from "./constants";
import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";

const EXTENTION = process.env.NODE_ENV === "prod" ? "js" : "ts";
const REG_EXP = new RegExp(`[\\w\\W]+\\.subcommand\\.${EXTENTION}`);

export class SubcommandsDeployer {
  private readonly logger = new Logger("Commands");
  
  public constructor(public readonly dirname: string) {};

  public execute(name: string) {
    return Object.fromEntries(readdirSync(join(this.dirname)).filter(file => 
      REG_EXP.test(file)).map(file => {
        const subcommand = require(join(this.dirname, file)).default as typeof Subcommand<Response>;
        this.logger.execute(`Субкоманда ${name.toLowerCase()}>${subcommand.name}`)
        return subcommand;
      }).map(subcommand => [subcommand.name.toLowerCase(), subcommand])) as {[key: string]: typeof Subcommand<Response>};
  };
}

export class SubcommandsCreator implements SubcommandsInitializer<Response> {
  public readonly subcommands: { [name: string]: typeof Subcommand<Response> };

  public constructor(
    public readonly name: string,
    dirname: string
  ) {
    this.subcommands = new SubcommandsDeployer(dirname).execute(name);
  }

  public async execute(interaction: CommandInteraction): Promise<Response> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subcommand: string = (interaction.options as any).getSubcommand();

    if (!(subcommand in this.subcommands)) {
      return { successed: false, data: `subcommand ${subcommand} not found.` };
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (this.subcommands as any)[subcommand](interaction).execute(interaction);
  };
}

export default SubcommandsDeployer;
