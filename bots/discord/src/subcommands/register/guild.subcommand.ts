import { Subcommand } from "@voidy/types/dist/commands/discord-command.type";
import { Response } from "../constants";
import { CommandInteraction, SlashCommandSubcommandBuilder, Sticker } from "discord.js";

import { MODELS } from "@thevoidcommunity/the-void-database/database";
import { IGuild } from "@thevoidcommunity/the-void-database/types/guild.type";
import { Settings } from "@thevoidcommunity/the-void-database/settings/settings";

const { Guild: GuildModel } = MODELS;

export class Guild extends Subcommand<Response> {
  public static readonly subcommand = new SlashCommandSubcommandBuilder()
    .setName("guild")
    .setDescription("Регистрация гильдии в БД");

  public constructor() {
    super();
  }

  public readonly execute = async (interaction: CommandInteraction) => {
    const guild = interaction.guild;

    if (!guild) {
      return { successed: false, data: "Гильдия не была найдена." };
    }

    const finded = await GuildModel.findOne({ id: guild.id });

    if (finded) {
      return { successed: false, data: "Гильдия уже зарегистрированна." };
    }

    await GuildModel.create(<IGuild>{
      id: guild.id,
      name: guild.name,
      members: guild.members.cache.map((user) => user.id),
      created_at: guild.createdAt.toISOString(),
      icon_url: guild.icon || "",
      owner_id: guild.ownerId,
      settings: (
        Settings.CONSTANTS.raw.default.guild | Settings.CONSTANTS.raw.default.logging
      ).toString(),
      config: {
        guild: {
          when_user_join_into_guild_send_message_to_user: [] as string[],
          when_user_join_into_guild_grant_roles: null,
          when_user_join_into_guild_send_hello_message_to_channel: null,
          when_user_join_into_voice_create_voice_and_move_him: null,
          when_user_leave_from_guild_send_goodbye_message_to_channel: null,
          when_user_leave_from_guild_send_message_to_user: null
        },
        logging: {
          when_bot_join_into_guild_send_log_into_channel: null,
          when_bot_leave_from_guild_send_log_into_channel: null,
          when_user_join_into_guild_send_log_into_channel: null,
          when_user_leave_from_guild_send_log_into_channel: null,
          when_message_was_sended_send_log_into_channel: null,
          when_message_was_changed_send_log_into_channel: null,
          when_message_was_deleted_send_log_into_channel: null,
          when_user_change_profile_send_log_into_channel: null,
          when_user_change_activity_send_log_into_channel: null,
          when_user_takes_mute_send_log_into_channel: null,
          when_user_takes_ban_send_log_into_channel: null,
          when_roles_changes_at_user_send_log_into_channel: null,
          when_guild_profile_changes_send_log_into_channel: null
        }
      }
    });

    return { successed: true, data: "Гильдия была зарегистрированна." };
  };
}

export default Guild;
