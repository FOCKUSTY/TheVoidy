import * as Telegraf from "telegraf";
const { FmtString } = Telegraf.Format;

import { Types } from "@voidy/types";
import { Commit } from "@voidy/types/dist/services/github-api.type";

const SPACE = " ==== " as const;
const helpJSON = JSON.stringify(
  {
    "repos?": {
      "[repo_name: string]": { "[area: string]": "boolean" }
    },
    "visualisation?": {
      "repos?": "[ REPO_NAME ]",
      "areas?": "— COMMIT_NAME",
      "items?": " = ITEM_NAME"
    },
    "special?": ["[", "]", "-"]
  },
  undefined,
  4
);
const helpString =
  "Пример команды: /github_commits ==== Lazy-And-Focused ==== orgs\n" +
  "Первое значение — название Вашего владельца репозиториев (Ваш Github или организация в Github)\n" +
  "Второе значение — тип Вашей организации (orgs | users)\n" +
  "Третье значение — JSON дата того, что Вы хотите видеть, то есть Ваш шаблон\n";

const helpString2 = `К слову, используйте в качестве разделителя: [${SPACE}]`;

const getHelp = (code: string | number = "0000", str: string = "") => {
  const help =
    "Код ошибки: " + code + "\n" + str + "\n" + helpString + helpString2 + "\n" + helpJSON;
  return new FmtString(help, [
    {
      type: "blockquote",
      length: helpJSON.length,
      offset: help.length - helpJSON.length
    },
    {
      type: "code",
      length: SPACE.length,
      offset: help.length - helpJSON.length - SPACE.length - 2
    }
  ]);
};

export default class Command extends Types.Telegram.Command {
  public constructor(services: Types.Services<{ github: Types.Github.Api }>) {
    super({
      name: "github_commits",
      async execute(interaction) {
        if (!interaction.from) return;

        const lazyCommand = interaction.message.text.split(" ==== ") as [
          string,
          string?,
          string?,
          string?,
          string?
        ];

        const command = {
          name: lazyCommand[0],
          repoOwner: lazyCommand[1],
          ownerType: lazyCommand[2],
          data: lazyCommand[3],
          linkEnabled: lazyCommand[4]
        } as const;

        const linksEnabled = command.linkEnabled === "true" ? true : false;

        if (lazyCommand.length < 3 || !command.repoOwner || !command.ownerType)
          return await interaction.reply(getHelp(1, "Не хватает данных"));

        const ownerType = command.ownerType as Types.Github.RepoOwners;

        if (!Types.Github.REPO_OWNERS.includes(ownerType))
          return await interaction.reply(getHelp(2, "Тип владельца репозиториев выбран не верно"));

        const { repos } = await services.github.getRepositories(command.repoOwner, ownerType, [
          ".github",
          "demo-repository"
        ]);

        const reposToPattern: { [key: string]: { link: string; commits: Commit[] } } = {};
        for (const repo of (repos||[])) {
          reposToPattern[repo.name] = {
            link: repo.html_url,
            commits: (await services.github.getCommits(repo.url)).commits
          };
        }

        const objectRepos: {
          [repo_name: string]: string[];
        } = {};

        try {
          const data = JSON.parse(
            command.data || JSON.stringify(Types.Patterns.Formatting.DEFAULT_PRESETS),
            undefined
          );

          const text = services.telegram.Format({
            repos: reposToPattern,
            pattern: {
              ...data,
              repos: data.repos || objectRepos,
              visualisation:
                data.visualisation || Types.Patterns.Formatting.DEFAULT_PRESETS.visualisation
            },
            linkEnabled: linksEnabled
          });

          return await interaction.reply(text);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          await interaction.reply(
            getHelp("0000", "Error:\n" + error.stack || error.message || error)
          );
          await interaction.reply(
            "Однако после этого мы всё равно продолжим, использую наш стандартный шаблон"
          );

          try {
            const text = services.telegram.Format({
              repos: reposToPattern,
              pattern: {
                repos: objectRepos,
                visualisation: Types.Patterns.Formatting.DEFAULT_PRESETS.visualisation
              },
              linkEnabled: linksEnabled
            });

            return await interaction.reply(text);
          } catch (err) {
            console.error(err);
            return await interaction.reply(`${err}`);
          }
        }
      }
    });
  }
}
