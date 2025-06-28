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
    .addSubcommand(() => create.subcommand),
  async execute(interaction: CommandInteraction) {
    return subcommandsInitializer.execute(interaction);
  }
});
