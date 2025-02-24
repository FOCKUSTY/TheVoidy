import { Env } from "@voidy/develop/dist";

import { Services } from "@voidy/types/dist/all/services.type";
import { GitHubApi } from "@voidy/types/dist/utils/github.type";

import TelegramCommand from "@voidy/types/dist/commands/telegram-command.type";
import { Random } from "random-js";

import { DateFormatter } from "f-formatter";
import { MessageEntity } from "telegraf/types";
import * as Telegraf from "telegraf";

const { FmtString } = Telegraf.Format;
const ids = (Env.data.TELEGRAM_TEAM_IDS || "").split(",");
const cats = ["Рыжий", "Персидский", "Голубой", "Серый", "Трёхйветный", "Сфинкс"];

const week = 7 * 24 * 60 * 60 * 1000;
const dash = "—";

const ownerTypes = ["users", "orgs"];

const getCat = () => cats[new Random().integer(0, cats.length - 1)];

export default class Command extends TelegramCommand {
	public constructor(services: Services<{ github: GitHubApi }>) {
		super({
			name: "github_updates",
			options: ["owner", "type"],
			async execute(interaction) {
				if (!interaction.from?.id || !interaction.message.text)
					return await interaction.reply(
						"Произошла ошибка, кот ошибки: " + getCat() + " 1"
					);

				if (!ids.includes(`${interaction.from.id}`))
					return await interaction.reply(
						"Произошла ошибка, кот ошибки: " + getCat() + " 2"
					);

				if (interaction.message.text.split(" ").length !== 3)
					return await interaction.reply(
						"Вы должны ввести команду и название владельца репозиториев, к примеру: /github-updated Lazy-And-Focused orgs\nПервый аргумент - название владельца репозитория, второй - тип владельца, может быть: orgs или users"
					);

				const [_, owner, type] = interaction.message.text.split(" ");

				if (!ownerTypes.includes(type))
					return await interaction.reply(
						"Тип владельца может быть только orgs или users"
					);

				const repositories = await services.github.getRepositories(owner, type, [
					".github"
				]);
				const repos = repositories
					.filter((r) => services.github.repositoryCommited(r, week))
					.map((r) => [r.name, r.html_url, `${r.pushed_at}`]);

				const conclusion = "Итоги за неделю\n";
				const updates = "За последнее время были обновлены:\n";

				let text = conclusion + updates;

				const entities: MessageEntity[] = [
					{
						length: conclusion.length,
						offset: 0,
						type: "blockquote"
					},
					{
						length: updates.length,
						offset: conclusion.length,
						type: "bold"
					}
				];

				for (const repo of repos) {
					const date = `${new DateFormatter().Date(Date.parse(repo[2]), "dd.MM.yyyy HH:mm:ss")}`;
					const name = repo[0];
					const string = dash + " " + name + " " + dash + " " + date;
					text += string + "\n";

					entities.push({
						offset: text.length - string.length + 1,
						length: name.length,
						type: "text_link",
						url: repo[1]
					});
				}

				return await interaction.reply(new FmtString(text, entities), {
					link_preview_options: {
						is_disabled: true,
						show_above_text: true
					}
				});
			}
		});
	}
}
