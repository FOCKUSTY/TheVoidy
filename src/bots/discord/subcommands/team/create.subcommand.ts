import { Subcommand } from "@discord/types/command.type";

import {
  CategoryChannel,
  Channel,
  ChannelType,
  CommandInteraction,
  Guild,
  GuildMember,
  OverwriteResolvable,
  Role,
  SlashCommandSubcommandBuilder
} from "discord.js";

import { Debug, Env } from "@develop";
import { MODELS, Database } from "@thevoidcommunity/the-void-database/database";
import { CHANNELS, resolveTeamName, ROLES } from "./constants";
import { Response } from "../constants";

const { GUILD_ID } = Env.env;
const Team = new Database(MODELS.Team);

export class Create extends Subcommand<Response> {
  public static readonly options = {
    owner: {
      name: "ceo",
      description: "CEO (ГИД) команды",
      required: false
    } as const,
    name: {
      name: "name",
      description: "Название команды",
      required: true
    } as const
  } as const;

  public static readonly subcommand: SlashCommandSubcommandBuilder =
    new SlashCommandSubcommandBuilder()
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
      );

  private _data: {
    name: string;
    owner: GuildMember;
  };

  public constructor(interaction: CommandInteraction) {
    super();
    this._data = this.resolveOptions(interaction);
  }

  public readonly execute = async (interaction: CommandInteraction): Promise<Response> => {
    Debug.Log([interaction.member?.user.id + ": попытка регистрации команды...."]);
    const guild = interaction.client.guilds.cache.get(GUILD_ID);

    if (!guild || !interaction.member) {
      Debug.Log(["Команда не была зарегистрирована: гильдия или пользователь не найдены"]);
      return { successed: false, data: "No guild or member info." };
    }

    const gettedTeam = await Team.getData({ filter: { name: this._data.name } });

    if (gettedTeam.successed) {
      Debug.Log([interaction.user.id + ": команда не была зарегистрирована: команда уже зарегестрирована"]);
      return { successed: false, data: `Team with name ${this._data.name} is exists.` };
    }

    Debug.Log([interaction.user.id + ": инициализация каналов и ролей..."]);
    const roles = await this.createRoles(guild);
    const category = await this.createCategory({ guild, roles: roles[0] });
    const channels = await this.createChannels({ guild, category });
    Debug.Log([interaction.user.id + "каналы и роли инициализированы"])

    const id = Database.generateId();
    const members = new Map<string, string[]>();

    Debug.Log([interaction.user.id + ": выдача ролей..."])
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
    Debug.Log([interaction.user.id + ": роли выданы"])

    Debug.Log([interaction.user.id + ": создание команды..."])
    const team = (
      await Team.create({
        id,
        members,
        name: this._data.name,
        owner_id: this._data.owner.id,
        channels: [...channels.map((channel) => channel.id), category.id],
        roles: new Map(roles[0].map((role) => [role.id, role.name]))
      })
    ).toObject().name;
    Debug.Log([interaction.user.id + ": команда", '"' + team + '"', "создана"])

    return { successed: true, data: `Team "${team}" was created.` };
  };

  private resolveMemberRoles({
    member,
    roles,
    map
  }: {
    member: GuildMember;
    roles: string[];
    map: Map<string, string[]>;
  }) {
    const memberRoles = member.roles.cache;
    const filtered = roles.filter((roleId) => memberRoles.get(roleId) !== undefined);

    map.set(member.id, filtered);

    return map;
  }

  private resolveOptions(interaction: CommandInteraction) {
    const name = interaction.options.get(Create.options.name.name, true).value as string;
    const owner = (interaction.options.get(Create.options.owner.name)?.member ||
      interaction.member) as GuildMember | null;

    if (!owner) throw Debug.Error("owner is not defined");

    return (this._data = {
      name,
      owner
    });
  }

  private async createRoles(guild: Guild) {
    const output: [Role[], string[]] = [[], []];

    for (const roleName of ROLES) {
      Debug.Log(["Создаю роль", roleName + "..."]);
      const role = await guild.roles.create({
        name: roleName + " | " + this._data.name,
        position: 9
      });

      Debug.Log([`Роль ${role.name} (${role.id}) создана`]);

      if (roleName === "CEO" || roleName === "TEAM") {
        Debug.Log([this._data.owner.id + ": выдача роли", roleName + "..."]);
        this._data.owner.roles.add(role).then(() => {
          Debug.Log([this._data.owner.id + ": роль", roleName, "выдана"]);
        });
      }

      output[0].push(role);
      output[1].push(role.id);
    }

    return output;
  }

  private createCategory({ guild, roles }: { guild: Guild; roles: Role[] }) {
    Debug.Log(["Создаю категорию", resolveTeamName(this._data.name) + "..."]);
    return guild.channels.create({
      name: resolveTeamName(this._data.name),
      type: ChannelType.GuildCategory,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: ["ViewChannel", "Connect"]
        },
        ...roles.map((role) => {
          return {
            id: role.id,
            allow: ["ViewChannel", "Connect"],
            type: 0
          } as OverwriteResolvable;
        })
      ],
      position: 3
    });
  }

  private async createChannels({ guild, category }: { guild: Guild; category: CategoryChannel }) {
    const output: Channel[] = [];

    for (const channelData of CHANNELS) {
      Debug.Log(["Создаю канал", channelData.name + "..."])
      const channel = await guild.channels.create({
        ...channelData,
        parent: category
      });

      Debug.Log([`Создан ${channel.name} (${channel.id})`]);
      output.push(channel);
    }

    return output;
  }
}

export default Create;
