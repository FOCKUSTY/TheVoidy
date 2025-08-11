import { Debug } from "@develop";
import {
  ActionRowBuilder,
  ChannelType,
  Guild as DiscordGuild,
  EmbedBuilder,
  OverwriteResolvable,
  PermissionsBitField,
  User,
  VoiceBasedChannel,
  VoiceChannel
} from "discord.js";

import { global as buttons } from "@discord/utility/buttons";

export const cache = new Map<string, string>();

export const PERMISSIONS = {
  banned: [],

  user: [
    PermissionsBitField.Flags.Stream,
    PermissionsBitField.Flags.Speak,
    PermissionsBitField.Flags.UseApplicationCommands,
    PermissionsBitField.Flags.AttachFiles,
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.Connect,
    PermissionsBitField.Flags.SendMessages
  ],

  owner: [
    PermissionsBitField.Flags.MuteMembers,
    PermissionsBitField.Flags.DeafenMembers,
    PermissionsBitField.Flags.MoveMembers
  ]
};

export const channels = new Map<string, Channel>();

export class List {
  private _enabled: boolean = false;
  private _users: Map<string, boolean> = new Map();

  public switch() {
    Debug.Log(["Изменения списка с", this._enabled, "на", !this._enabled]);
    this._enabled = !this._enabled;

    return this._enabled;
  }

  public addUser(id: string) {
    Debug.Log(["Добавленение", id, "в список"]);
    this._users.set(id, true);
  }

  public removeUser(id: string) {
    Debug.Log(["Удаление", id, "из списка"]);
    this._users.set(id, false);
  }

  public get enabled(): boolean {
    return this._enabled;
  }

  public get users(): Map<string, boolean> {
    return this._users;
  }
}

export class Channel {
  private readonly _blackList: List;
  private readonly _whiteList: List;

  private _channel: VoiceChannel | null = null;
  private _ownerId: string;

  public constructor(ownerId: string) {
    this._ownerId = ownerId;

    this._blackList = new List();
    this._whiteList = new List();
  }

  public async execute({
    guild,
    channel,
    user
  }: {
    guild: DiscordGuild;
    channel: VoiceBasedChannel;
    user: User;
  }): Promise<{ id: string; channel: Channel }> {
    this._channel = await guild.channels.create({
      name: `${user.displayName}'s channel`,
      type: ChannelType.GuildVoice,
      parent: channel.parent,
      position: channel.position,
      permissionOverwrites: [
        <OverwriteResolvable>{ id: user.id, allow: [...PERMISSIONS.user, ...PERMISSIONS.owner] }
      ]
    });

    return { id: this._channel.id, channel: this };
  }

  public async transmitOwner(ownerId: string) {
    Debug.Log(ownerId+ ": попытка передачи прав...")

    const oldOwner = this._ownerId;
    this._ownerId = ownerId;

    if (!this._channel) {
      Debug.Log(ownerId + ": передача не удалась: канал не найден");
      return null;
    };

    Debug.Log("Передача прав... наверное удалась");

    return this._channel.permissionOverwrites.set([
      {
        id: oldOwner,
        allow: [...PERMISSIONS.user]
      },
      {
        id: ownerId,
        allow: [...PERMISSIONS.user, ...PERMISSIONS.owner]
      }
    ]);
  }

  public get channel() {
    return this._channel;
  }

  public get ownerId() {
    return this._ownerId;
  }

  public get blackList() {
    return this._blackList;
  }

  public get whiteList() {
    return this._whiteList;
  }
}

export const sendService = async (
  channel: Channel & { channel: NonNullable<Channel["channel"]> }
) => {
  Debug.Log([`Отправляю настройки голосового канала в ${channel.channel.name} (${channel.channel.id})....`])
  const embed = new EmbedBuilder()
    .setAuthor({
      name: channel.channel.client.user.username,
      iconURL: channel.channel.client.user.avatarURL() || undefined
    })
    .setTitle("Это инструменты для управления Вашим голосовым каналом!")
    .setDescription(
      "Снизу есть кнопки для Вашего удобства, просто жмите на них и будет выпадать модальное меню с инструкциями"
    )
    .setTimestamp()
    .setFooter({
      text: "The Void Commnunity",
      iconURL: channel.channel.client.user.avatarURL() || undefined
    });

  channel.channel.send({
    content: "Привет! Это настройки войс канала!",
    embeds: [embed],
    components: [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <any>(
        new ActionRowBuilder().addComponents(
          ...[
            buttons["voice-switch-black-list"].builder,
            buttons["voice-switch-white-list"].builder
          ]
        )
      )
    ]
  }).then(() => {
    Debug.Log([`Настройки голосового канала были отправлены в ${channel.channel.name} (${channel.channel.id})`]);
  });
};
