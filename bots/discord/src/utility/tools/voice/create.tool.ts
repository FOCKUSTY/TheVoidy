import { MODELS } from "@thevoidcommunity/the-void-database/database";
import { cache, Channel, channels, sendService } from "./data";

import {
  VoiceChannel,
  VoiceState
} from "discord.js";

const { Guild } = MODELS;

const usersTimeout = new Map<string, NodeJS.Timeout>();

export class Tool {
  public static name = "create";
  
  private readonly cache = cache;
  private readonly channels = channels;

  public async execute(oldVoiceState: VoiceState, newVoiceState: VoiceState) {
    const channel = await this.getCache(newVoiceState.guild.id);

    usersTimeout.delete(newVoiceState.id);

    if (newVoiceState.channel !== channel && oldVoiceState.channelId) {
      const successed = await this.deleteChannel({id: oldVoiceState.channelId, oldVoiceState, newVoiceState});
      
      if (successed) return;
    };

    if (!channel) return;
    if (!newVoiceState.member) return;
    if (newVoiceState.channelId !== channel) return;

    const createdChannel = await this.createChannel({ voiceState: newVoiceState, ownerId: newVoiceState.member.id });

    if (!createdChannel || !createdChannel.channel) return;
    
    await this.moveMember(newVoiceState, createdChannel.channel);
    await this.sendService(createdChannel as (Channel & {channel: NonNullable<Channel["channel"]>}));
  };
  
  private sendService = sendService;
  
  private async createChannel({ voiceState, ownerId}: {ownerId: string, voiceState: VoiceState}) {
    if (!voiceState.member?.user) return null;
    if (!voiceState.channel) return null;

    const { id, channel } = await new Channel(ownerId).execute({ user: voiceState.member.user, guild: voiceState.guild, channel: voiceState.channel });
    
    this.channels.set(id, channel);
    
    return channel;
  }

  private async deleteChannel({oldVoiceState, newVoiceState, id}: {oldVoiceState: VoiceState, newVoiceState: VoiceState, id: string}) {
    if (!this.channels.has(id)) return false;

    return new Promise<boolean>((resolve) => {
      const timeout = setTimeout(async () => {
        await oldVoiceState.guild.channels.delete(id);
        this.channels.delete(id);

        usersTimeout.delete(newVoiceState.id);
        resolve(true);
      }, 10_000);

      usersTimeout.set(newVoiceState.id, timeout);
    });
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
