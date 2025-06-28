import { Subcommand, SubcommandsInitializer } from "@voidy/types/dist/commands/discord-command.type";
import { CommandInteraction } from "discord.js";

import SubcommandsDeployer from "../index";
import { Response } from "../constants";

export class Subcommands implements SubcommandsInitializer<Response> {
  public readonly name = "team" as const;

  public readonly subcommands: {
    [name: string]: typeof Subcommand<Response>;
  } = new SubcommandsDeployer().execute("team");

  public async execute(interaction: CommandInteraction): Promise<Response> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subcommand: string = (interaction.options as any).getSubcommand();

    if (!(subcommand in this.subcommands)) {
      return { successed: false, data: `subcommand ${subcommand} not found.` };
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new (this.subcommands as any)[subcommand](interaction).execute(interaction);
  };
};

export default Subcommands;
