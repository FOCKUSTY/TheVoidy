import { MODELS } from "@thevoidcommunity/the-void-database/database";

import {
  ChannelType,
  Guild as DiscordGuild,
  OverwriteResolvable,
  PermissionsBitField,
  User,
  VoiceBasedChannel,
  VoiceChannel,
  VoiceState
} from "discord.js";

const { Guild } = MODELS;

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
    PermissionsBitField.Flags.SendMessages,
  ],
  
  owner: [
    PermissionsBitField.Flags.MuteMembers,
    PermissionsBitField.Flags.DeafenMembers,
    PermissionsBitField.Flags.MoveMembers,
  ]
};

class List {
  private _enabled: boolean = false;
  private _users: Map<string, boolean> = new Map();

  public switch() {
    this._enabled = !this._enabled;
  }
  
  public addUser(id: string) {
    this._users.set(id, true);
  }
  
  public removeUser(id: string) {
    this._users.set(id, false);
  };

  public get enabled(): boolean {
    return this._enabled;
  }

  public get users(): Map<string, boolean> {
    return this._users;
  }
};

class Channel {
  private readonly _blackList: List;
  private readonly _whiteList: List;
  
  private _channel: VoiceChannel|null = null;
  private _ownerId: string;

  public constructor(ownerId: string) {
    this._ownerId = ownerId;

    this._blackList = new List();
    this._whiteList = new List();
  }

  public async execute({ guild, channel, user }: { guild: DiscordGuild, channel: VoiceBasedChannel, user: User }) {
    this._channel = await guild.channels.create({
      name: `${user.displayName}'s channel`,
      type: ChannelType.GuildVoice,
      parent: channel.id,
      permissionOverwrites: [<OverwriteResolvable>{id: user.id, allow: [ ...PERMISSIONS.user, ...PERMISSIONS.owner ] }]
    });

    return { id: this._channel.id, channel: this};
  };

  public async transmitOwner(ownerId: string) {
    const oldOwner = this._ownerId;
    this._ownerId = ownerId;

    if (!this._channel) return null;

    return await this._channel.permissionOverwrites.set([{
        id: oldOwner,
        allow: [ ...PERMISSIONS.user ]
      }, {
        id: ownerId,
        allow: [ ...PERMISSIONS.user, ...PERMISSIONS.owner ]
      }]
    );
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
};

// class Service {
  // require button listener
// };

export class Tool {
  private readonly cache = cache;
  private readonly channels = new Map<string, Channel>();

  public async execute(_oldVoiceState: VoiceState, newVoiceState: VoiceState) {
    const channel = await this.getCache(newVoiceState.guild.id);

    if (!channel) return;
    if (!newVoiceState.member) return;
    
    const createdChannel = await this.createChannel({ voiceState: newVoiceState, ownerId: newVoiceState.member.id });
    
    if (!createdChannel || !createdChannel.channel) return;
    
    await this.moveMember(newVoiceState, createdChannel.channel);
  };
  
  private sendService() {}
  
  private async createChannel({ voiceState, ownerId}: {ownerId: string, voiceState: VoiceState}) {
    if (!voiceState.member?.user) return null;
    if (!voiceState.channel) return null;

    const { id, channel } = await new Channel(ownerId).execute({ user: voiceState.member.user, guild: voiceState.guild, channel: voiceState.channel });
    
    this.channels.set(id, channel);
    
    return channel;
  }

  private deleteChannel(id: string) {
    return this.channels.delete(id);
  }

  private moveMember(voiceState: VoiceState, channel: VoiceChannel) {
    if (!voiceState.member) return;

    return voiceState.member.voice.setChannel(channel);
  }

  private async getCache(guildId: string) {
    const cachedData = this.cache.get(guildId);

    if (cachedData === "null_of_channel_id") { return null };

    if (!cachedData) {
      const guild = await Guild.findOne({ id: guildId });
      
      if (!guild) { return null };

      const channelId = guild.toObject().config.guild.when_user_join_into_voice_create_voice_and_move_him;
      
      if (!channelId) {
        this.cache.set(guildId, "null_of_channel_id");
        return null;
      };

      this.cache.set(guildId, channelId);

      return channelId;
    };

    return cachedData;
  }
};

export default Tool;
