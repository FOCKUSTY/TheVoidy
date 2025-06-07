import { Types } from "@voidy/types";

import {
  CommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  time,
  User,
  GuildMember,
  MessageFlags
} from "discord.js";

export default new Types.Discord.Command({
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Пользователь !")
    .addUserOption((o) =>
      o
        .setName("member")
        .setDescription("Участник")
        .setNameLocalizations({ ru: "участник", "en-US": "member" })
        .setDescriptionLocalizations({
          ru: "Участник сервера",
          "en-US": "Member in guild"
        })
    )

    .setNameLocalizations({ ru: "пользователь", "en-US": "user" })
    .setDescriptionLocalizations({
      ru: "Информация о пользователе",
      "en-US": "Info about user"
    }),
  async execute(interaction: CommandInteraction) {
    const iconURL = interaction.client.application.iconURL() || undefined;
    await interaction.reply({
      content: `# :tophat:\n Собираем информацию...`,
      fetchReply: true,
      flags: MessageFlags.Ephemeral
    });

    const user = interaction.options.get("member")
      ? (interaction.options.get("member") as unknown as User)
      : interaction.user;

    const username = user.globalName || user.username;

    if (!interaction.guild) {
      await interaction.editReply({ content: `# :tophat:\n Сервер не найден...` });

      const embed = new EmbedBuilder()
        .setColor(0x161618)
        .setAuthor({ name: `The Void`, iconURL: iconURL })
        .setTitle(`Об участнике ${user.username}`)
        .setDescription(`Информация об участнике ${username}`)
        .addFields(
          {
            name: `Команда запущена:`,
            value: `${interaction.user} (${interaction.user.username})`,
            inline: true
          },
          {
            name: `Пользователь ${username} присоединился:`,
            value: `${time(user.createdAt)}\nЭто:\n${time(user.createdAt, `R`)}`,
            inline: true
          }
        )
        .setThumbnail(user.avatarURL())
        .setTimestamp()
        .setFooter({ text: `The Void`, iconURL: iconURL });

      return await interaction.editReply({ embeds: [embed] });
    }

    const guildIconURL = interaction.guild.iconURL() || undefined;
    const member = interaction.guild.members.cache.get(user.id) as GuildMember;

    const roles: string[] = [];

    new Map(
      [...member.roles.cache.entries()].sort((a, b) => b[1].position - a[1].position)
    ).forEach((role) => roles.push(role.name));

    const embed = new EmbedBuilder()
      .setColor(0x161618)
      .setAuthor({ name: interaction.guild.name, iconURL: guildIconURL })
      .setTitle(`Об участнике ${username}`)
      .setDescription(
        `Информация об участнике ${interaction.user.username} на сервере ${interaction.guild.name}`
      )
      .addFields(
        {
          name: `Команда запущена:`,
          value:
            `${interaction.user} (${interaction.user.username})\n` +
            "**Участник " +
            member.user.username +
            " присоединился:**\n" +
            `<t:${Math.round((member.joinedTimestamp || 0) / 1000)}>\nЭто:\n<t:${Math.round((member.joinedTimestamp || 0) / 1000)}:R>` +
            "\n" +
            "**Пользователь в Discord:**\n" +
            `${time(user.createdAt)}\nЭто:\n${time(user.createdAt, `R`)}`,
          inline: true
        },
        {
          name: `Роли участника:`,
          value: `${roles.join("\n")}`,
          inline: true
        }
      )
      .setThumbnail(
        `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
      )
      .setTimestamp()
      .setFooter({
        text: `${interaction.guild.id} - ${interaction.guild.name}`,
        iconURL: guildIconURL
      });

    return await interaction.editReply({ embeds: [embed] });
  }
});
