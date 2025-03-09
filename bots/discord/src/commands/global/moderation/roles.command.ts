import { Voidy } from "v@types";
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { CommandInteraction, Role, Collection, EmbedField } from "discord.js";
import Formatter from "f-formatter";

export default new Voidy.Discord.Command({
  data: new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Все роли на сервере !")
    .setNameLocalizations({ ru: "роли", "en-US": "roles" })
    .setDescriptionLocalizations({
      ru: "Все роли на сервере",
      "en-US": "All roles on guild"
    }),

  async execute(interaction: CommandInteraction) {
    if (!interaction.guild)
      return await interaction.reply({
        content: "Вы находитесь не в гильдии",
        ephemeral: true
      });

    const guildRoles: Collection<string, Role> = interaction.guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .filter((role) => role.name != "@everyone");

    const totalRoles = guildRoles.map((role) => role);
    const rolesCount = totalRoles.length;

    const roles: string[][] = [];
    const fields: EmbedField[] = [];

    await interaction.reply({
      content: "# :tophat:\n Считаем роли...",
      fetchReply: true,
      ephemeral: true
    });

    for (let i = 0; i < rolesCount; i += 30) {
      const index = i / 30;
      roles.push([]);

      for (let j = i; j < i + 30; j++) {
        if (!totalRoles[j]?.id) continue;

        roles[index].push(`${1 + i}. <@&${totalRoles[j].id}>`);
      }

      const word = new Formatter().RuWords(roles[index].length, ["роль", "роли", "ролей"]);

      if (index % 2 === 0 && index !== 0) fields.push({ inline: false, name: "ﾠ", value: "ﾠ" });

      fields.push({
        inline: true,
        name: `${roles[index].length} ${word}, подсчет номер ${index + 1}`,
        value: roles[index].join("\n")
      });
    }

    const name = interaction.guild.name;
    const icon = `https://cdn.discordapp.com/icons/${interaction.guild.id}/${interaction.guild.icon}.png`;

    const text = `Всего ${rolesCount} ${new Formatter().RuWords(rolesCount, ["роль", "роли", "ролей"])}`;

    const embed = new EmbedBuilder()
      .setColor(0x161618)
      .setAuthor({ name: name, iconURL: icon })
      .setTitle(`${name} ${text}`)
      .setFields(fields)
      .setTimestamp()
      .setFooter({ text: `${interaction.guild.id} - ${text}`, iconURL: icon });

    await interaction.editReply({ embeds: [embed] });
  }
});
