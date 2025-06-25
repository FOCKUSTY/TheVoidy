import { Subcommand } from "@voidy/types/dist/commands/discord-command.type";

import { CommandInteraction } from "discord.js";

export class Create implements Subcommand<unknown> {
  public static readonly name = "create" as const;

  public static readonly options = {
    owner: {
      name: "ceo",
      description: "CEO (ГИД) команды",
      required: false,
    } as const,
    name: {
      name: "name",
      description: "Название команды",
      required: true
    } as const
  } as const;

  public async execute(interaction: CommandInteraction) {
    
  }
}

export default Create;
