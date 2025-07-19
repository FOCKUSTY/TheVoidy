import { Env } from "@voidy/develop";
import Command from "types/command.type";

import { SlashCommandBuilder, EmbedBuilder, CommandInteraction, MessageFlags } from "discord.js";

import commands from "commands/index.commads";

export default new Command({
  data: new SlashCommandBuilder()
    .setName("bot")
    .setDescription("Информация о боте !")
    .setNameLocalizations({ ru: "бот", "en-US": "bot" })
    .setDescriptionLocalizations({
      ru: "Информация о боте !",
      "en-US": "Info about bot !"
    }),

  async execute(interaction: CommandInteraction) {
    const name = interaction.client.user.username;
    const guild = await interaction.client.guilds.fetch(`${Env.env.GUILD_ID}`);
    const author = await interaction.client.users.fetch(`${Env.env.AUTHOR_ID}`);
    const support = Env.env.FRIEND_ID
      ? await interaction.client.users.fetch(`${Env.env.FRIEND_ID}`)
      : false;

    const iconURL = interaction.client.user.avatarURL() || undefined;

    const embed = new EmbedBuilder()
      .setColor(0x161618)
      .setTitle("Информация о The Void's bot")
      .setAuthor({ name: name, iconURL: iconURL })
      .addFields(
        {
          name: "Псевдоним:",
          value: `${name}`,
          inline: false
        },

        {
          name: "Версия:",
          value: "!!version!!",
          inline: false
        },

        {
          name: "Основной сервер:",
          value: `${guild.name}: ${guild.id}`,
          inline: false
        },

        {
          name: "Создатель:",
          value: `${author.globalName || author.username}: ${author.id}`,
          inline: false
        },

        {
          name: "Количество команд:",
          value: `${commands.size}`,
          inline: false
        },

        {
          name: "Количество серверов:",
          value: `${interaction.client.guilds.cache.size}`,
          inline: false
        },

        {
          name: "Поддержка:",
          value: support
            ? `${support.globalName || support.username}: ${support.id}`
            : "Чистый энтузиазм!",
          inline: false
        }
      )
      .setFooter({
        text: guild.name,
        iconURL: guild.iconURL() || undefined
      })
      .setTimestamp();

    return await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
});
