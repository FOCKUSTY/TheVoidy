import { ChannelType, GuildChannelCreateOptions } from "discord.js";

export const ROLES: string[] = [
  "CEO",
  "Team leader",
  "Architector",
  "Senior",
  "Middle",
  "Junior",
  "Begginer",
  "TEAM"
];

export const CHANNELS: GuildChannelCreateOptions[] = [{
  name: "▸основной",
  type: ChannelType.GuildText
}, {
  name: "▸идеи",
  type: ChannelType.GuildForum
}, {
  name: "▸Основной",
  type: ChannelType.GuildVoice
  }
];

export const resolveTeamName = (name: string) =>  `▨▸Команда ${name}◃▨`;