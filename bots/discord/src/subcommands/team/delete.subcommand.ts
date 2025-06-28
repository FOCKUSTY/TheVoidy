import { Subcommand } from "@voidy/types/dist/commands/discord-command.type";

import { Env } from "@voidy/develop";
import { MODELS, Database } from "@thevoidcommunity/the-void-database/database";
import { CHANNELS, resolveTeamName, ROLES } from "./constants";
import { Response } from "../constants";
import { CommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";

const { GUILD_ID } = Env.env;
const Team = new Database(MODELS.Team);

export class Delete extends Subcommand<Response> {
  public static readonly options = {
    name: {
      name: "name",
      description: "Название команды",
      required: true
    }
  };

  public static readonly subcommand = new SlashCommandSubcommandBuilder()
    .setName("del")
    .setDescription("Удаление команды")
    .addStringOption(o => o
      .setName(Delete.options.name.name)
      .setDescription(Delete.options.name.description)
      .setRequired(Delete.options.name.required)
    );

  private _data: {
    name: string
  } 

  public constructor(interaction: CommandInteraction) {
    super();
    this._data = this.resolveOptions(interaction);
  };

  public readonly execute = async (interaction: CommandInteraction) => {
    const teamData = await Team.getData({filter: { name: this._data.name }});

    if (!teamData.successed) {
      return { successed: false, data: teamData.text };
    };

    const team = teamData.resource[0];
    const isOwner = team.owner_id === interaction.user.id;
    if (!isOwner) {
      return { successed: false, data: `You is not owner in ${this._data.name}. Owner is: <@${team.owner_id}>` };
    };

    const channels = team.channels;
    const roles = Array.from(team.roles.keys());

    channels.forEach(channelId => interaction.guild?.channels.delete(channelId));
    roles.forEach(roleId => interaction.guild?.roles.delete(roleId));

    const deleted = await Team.delete({id: team.id});

    return { successed: true, data: `Team ${this._data.name} was deleted.\n\`\`\`${JSON.stringify(deleted, undefined, 2)}\`\`\`` };
  };

  private resolveOptions(interaction: CommandInteraction) {
    const name = interaction.options.get(Delete.options.name.name, true).value as string;

    return (this._data = {
      name,
    });
  }
};

export default Delete;
