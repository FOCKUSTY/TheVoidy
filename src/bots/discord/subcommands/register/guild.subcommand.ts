import { Subcommand } from "@discord/types/command.type";
import { Response } from "../constants";
import { CommandInteraction, SlashCommandSubcommandBuilder, Sticker } from "discord.js";

import { MODELS } from "@thevoidcommunity/the-void-database/database";
import { IGuild } from "@thevoidcommunity/the-void-database/types/guild.type";
import { Settings } from "@thevoidcommunity/the-void-database/settings/settings";
import { Debug } from "@develop";

const { Guild: GuildModel } = MODELS;

const cache = new Map<string, boolean>();

export class Guild extends Subcommand<Response> {
  public static readonly subcommand = new SlashCommandSubcommandBuilder()
    .setName("guild")
    .setDescription("Регистрация гильдии в БД");

  public constructor() {
    super();
  }

  public readonly execute = async (interaction: CommandInteraction) => {
    Debug.Log([interaction.guild + ": попытка регистрации гильдии..."]);
    const guild = interaction.guild;

    if (!guild) {
      Debug.Log(["Гильдия не была найдена: возможно вы не в гильдии"]);
      return { successed: false, data: "Гильдия не была найдена." };
    }

    const finded = cache.get(guild.id) ?? (await GuildModel.findOne({ id: guild.id }));

    if (finded) {
      cache.set(guild.id, true);
      Debug.Log(
        interaction.guild + ": гильдия не была зарегистрирована: гильдия уже зарегистрирована"
      );
      return { successed: false, data: "Гильдия уже зарегистрированна." };
    }

    cache.set(guild.id, true);
    Debug.Log(interaction.guild.id + ": регистрация гильдии...");

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
          when_user_join_into_guild_grant_roles: [] as string[],
          when_user_join_into_guild_send_message_to_user: { channel_id: null, message: "" },
          when_user_join_into_guild_send_hello_message_to_channel: {
            channel_id: null,
            message: ""
          },
          when_user_join_into_voice_create_voice_and_move_him: { channel_id: null, message: "" },
          when_user_leave_from_guild_send_goodbye_message_to_channel: {
            channel_id: null,
            message: ""
          },
          when_user_leave_from_guild_send_message_to_user: { channel_id: null, message: "" }
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

    Debug.Log(interaction.guild.id + ": гильдия была зарегистрирована");
    return { successed: true, data: "Гильдия была зарегистрированна." };
  };
}

export default Guild;
