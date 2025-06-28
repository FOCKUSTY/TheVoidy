import { SubcommandsInitializer } from "@voidy/types/dist/commands/discord-command.type";
import { CommandInteraction } from "discord.js";

import Create from "./create";

export class Subcommands implements SubcommandsInitializer<unknown> {
  public readonly name = "team" as const;

  public readonly subcommands = {
    [Create.name]: Create
  };

  public async execute(interaction: CommandInteraction) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subcommand: string = (interaction.options as any).getSubcommand();

    if (!(subcommand in this.subcommands)) {
      return false;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (this.subcommands as any)[subcommand](interaction).execute(interaction);
  };
};

export default Subcommands;
