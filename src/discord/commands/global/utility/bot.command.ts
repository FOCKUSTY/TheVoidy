import { SlashCommandBuilder, EmbedBuilder, CommandInteraction } from "discord.js";

import { config } from "config";
import { version } from "src/../package.json";
import commands from "discord/index.commads";

export = {
	cooldown: 5,
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
		const guild = await interaction.client.guilds.fetch(`${config.guildId}`);
		const author = await interaction.client.users.fetch(`${config.authorId}`);
		const support = await interaction.client.users.fetch(`${config.aculaOneId}`);

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
					value: version,
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
					value: `${commands.length}`,
					inline: false
				},

				{
					name: "Количество серверов:",
					value: `${interaction.client.guilds.cache.size}`,
					inline: false
				},

				{
					name: "Поддержка:",
					value: `${support.globalName || support.username}: ${support.id}`,
					inline: false
				}
			)
			.setFooter({
				text: guild.name,
				iconURL: guild.iconURL() || undefined
			})
			.setTimestamp();

		return await interaction.reply({ embeds: [embed], ephemeral: true });
	}
};
