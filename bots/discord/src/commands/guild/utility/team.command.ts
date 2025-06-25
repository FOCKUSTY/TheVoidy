import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Types } from "@voidy/types";

import Subcommands from "subcommands/team";

const subcommandsInitializer = new Subcommands();
const { name, subcommands } = subcommandsInitializer;
const { create } = subcommands;

export default new Types.Discord.Command({
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription("Управление командой !")
    .addSubcommand((s) => s
      .setName(create.name)
      .setDescription("Создание новой команды !")
      .addUserOption(o => o
        .setName(create.options.owner.name)
        .setDescription(create.options.owner.description)
        .setRequired(create.options.owner.required)
      )
      .addStringOption(o => o
        .setName(create.options.name.name)
        .setDescription(create.options.name.description)
        .setRequired(create.options.name.required)
      )
  ),
  async execute(interaction: CommandInteraction) {
    return subcommandsInitializer.execute(interaction);
  }
});
