import { Subcommand } from "@voidy/types/dist/commands/discord-command.type";

import { CategoryChannel, Channel, ChannelType, CommandInteraction, Guild, GuildMember, Role, SlashCommandSubcommandBuilder } from "discord.js";

import { Env } from "@voidy/develop";
import { MODELS, Database } from "@thevoidcommunity/the-void-database/database";
import { CHANNELS, resolveTeamName, Response, ROLES } from "./constants";

const { GUILD_ID } = Env.env;
const Team = new Database(MODELS.Team);

export class Create implements Subcommand<Response> {
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

  public static readonly subcommand: SlashCommandSubcommandBuilder = new SlashCommandSubcommandBuilder()
    .setName("create")
    .setDescription("Создание новой команды !")
    .addStringOption(o => o
      .setName(Create.options.name.name)
      .setDescription(Create.options.name.description)
      .setRequired(Create.options.name.required)
    )
    .addUserOption(o => o
      .setName(Create.options.owner.name)
      .setDescription(Create.options.owner.description)
      .setRequired(Create.options.owner.required)
    )
  
  private _data: {
    name: string;
    owner: GuildMember;
  };

  public constructor(interaction: CommandInteraction) {
    this._data = this.resolveOptions(interaction);
  };

  public async execute(interaction: CommandInteraction) {
    const guild = interaction.client.guilds.cache.get(GUILD_ID);

    if (!guild || !interaction.member) return { successed: false, data: "No guild or member info." };

    const gettedTeam = await Team.getData({filter: {name: this._data.name}})

    if (gettedTeam.successed) {
      return { successed: false, data: `Team with name ${this._data.name} is exists.` };
    };

    const roles = await this.createRoles(guild);
    const category = await this.createCategory(guild);

    await this.createChannels({ guild, category, roles: roles[0] });

    const id = await Team.generateId();
    const members = new Map<string, string[]>();

    this.resolveMemberRoles({
      member: interaction.member as GuildMember,
      map: members,
      roles: roles[1]
    });
    
    if (interaction.user.id !== this._data.owner.id) {
      this.resolveMemberRoles({
        member: this._data.owner,
        map: members,
        roles: roles[1]
      });
    }

    const team = (await Team.create({
      id,
      members,
      name: this._data.name,
      owner_id: this._data.owner.id,
      roles: new Map(roles[0].map(role => [role.id, role.name]))
    })).toObject().name;

    return { successed: true, data: `Team "${team}" was created.` }
  };

  private resolveMemberRoles({ member, roles, map }: {member: GuildMember, roles: string[], map: Map<string, string[]> }) {
    const memberRoles = member.roles.cache;
    const filtered = roles.filter(roleId => memberRoles.get(roleId) !== undefined);

    map.set(member.id, filtered);

    return map;
  }

  private resolveOptions(interaction: CommandInteraction) {
    const name = interaction.options.get(Create.options.name.name, true).value as string;
    const owner = (interaction.options.get(Create.options.owner.name)?.member || interaction.member) as GuildMember|null;

    if (!owner) throw new Error("owner is not defined");

    return this._data = {
      name,
      owner
    };
  };

  private async createRoles(guild: Guild) {
    const output: [Role[], string[]] = [[], []];
    
    for (const roleName of ROLES) {
      const role = await guild.roles.create({
        name: (roleName + " | " + this._data.name),
        position: 9
      });

      if (roleName === "CEO" || roleName === "TEAM") {
        this._data.owner.roles.add(role);
      };

      output[0].push(role);
      output[1].push(role.id);
    };

    return output;
  };

  private async createCategory(guild: Guild) {
    return await guild.channels.create({
      name: resolveTeamName(this._data.name),
      type: ChannelType.GuildCategory,
      position: 3
    });
  };

  private async createChannels({ guild, category, roles }: { guild: Guild, category: CategoryChannel, roles: Role[] }) {
    const output: Channel[] = [];

    for (const channelData of CHANNELS) {
      const channel = await guild.channels.create({
        ...channelData,
        parent: category,
        permissionOverwrites: roles
      });

      output.push(channel);
    };

    return output;
  };
}

export default Create;
