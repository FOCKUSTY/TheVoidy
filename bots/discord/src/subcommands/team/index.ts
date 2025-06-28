import { Subcommand, SubcommandsInitializer } from "@voidy/types/dist/commands/discord-command.type";
import { CommandInteraction } from "discord.js";
import { Logger } from "@voidy/develop";

import { Response } from "./constants";

import { readdirSync } from "node:fs";
import { join } from "node:path";

const EXTENTION = process.env.NODE_ENV === "prod" ? "js" : "ts";
const REG_EXP = new RegExp(`[\\w\\W]+\\.subcommand\\.${EXTENTION}`);


export class Subcommands implements SubcommandsInitializer<Response> {
  private readonly logger = new Logger("Commands");
  public readonly name = "team" as const;

  public readonly subcommands: {
    [name: string]: typeof Subcommand<Response>;
  } = {};

  public constructor() {
    this.subcommands = Object.fromEntries(this.deploy().map(subcommand => [subcommand.name, subcommand]));
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

  private deploy() {
    return readdirSync(join(__dirname)).filter(file => 
      REG_EXP.test(file)).map(file => {
        const subcommand = require(join(__dirname, file)).default as typeof Subcommand<Response>;
        this.logger.execute(`Субкоманда ${this.name}>${subcommand.name}`)
        return subcommand;
      });
  };
};

export default Subcommands;
