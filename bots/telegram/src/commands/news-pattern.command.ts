import * as Telegraf from "telegraf";
const { FmtString } = Telegraf.Format;

import { Types } from "v@types";

const helpJSON = JSON.stringify(
  {
    "repos?": {
      "[repo_name: string]": { "[area: string]": "boolean" }
    },
    "visualisation?": {
      "repos?": "string (REPO_NAME)",
      "areas?": "string (AREA_NAME)",
      "items?": "string (ITEM_NAME)"
    }
  },
  undefined,
  4
);
const helpString =
  "Первое значение — название Вашего владельца репозиториев (Ваш Github или организация в Github)\n" +
  "Второе значение — тип Вашей организации (orgs | users)\n" +
  "Третье значение — JSON дата того, что Вы хотите видеть, то есть Ваш шаблон\n";

const getHelp = (code: string | number = "0000", str: string = "") => {
  const help = "Код ошибки: " + code + "\n" + str + "\n" + helpString + "\n" + helpJSON;
  return new FmtString(help, [
    {
      type: "blockquote",
      length: helpJSON.length,
      offset: help.length - helpJSON.length
    }
  ]);
};

export default class Command extends Types.Telegram.Command {
  public constructor(services: Types.Services<{ github: Types.Github.Api }>) {
    super({
      name: "news_pattern",
      async execute(interaction) {
        if (!interaction.from) return;

        const lazyCommand = interaction.message.text.split(" ==== ") as [
          string,
          string?,
          string?,
          string?
        ];

        const command = {
          name: lazyCommand[0],
          repoOwner: lazyCommand[1],
          ownerType: lazyCommand[2],
          data: lazyCommand[3]
        } as const;

        if (
          (lazyCommand.length !== 3 && lazyCommand.length !== 4) ||
          !command.repoOwner ||
          !command.ownerType
        )
          return await interaction.reply(getHelp(1, "Не хватает данных"));

        const ownerType = command.ownerType as Types.Github.RepoOwners;

        if (!Types.Github.REPO_OWNERS.includes(ownerType))
          return await interaction.reply(getHelp(2, "Тип владельца репозиториев выбран не верно"));

        const { repos } = await services.github.getRepositories(command.repoOwner, ownerType, [
          ".github",
          "demo-repository"
        ]);

        const reposToPattern = repos.map((r) => {
          return { name: r.name, link: r.html_url };
        });

        const objectRepos: {
          [repo_name: string]: {
            [area_name: string]: boolean;
          };
        } = {};

        for (const repo of repos.map((r) => {
          return { [r.name]: { "some_area": true } };
        })) {
          for (const data of Object.entries(repo)) {
            objectRepos[data[0]] = data[1];
          }
        }

        try {
          const data = JSON.parse(
            command.data || JSON.stringify(Types.Patterns.Formatting.DEFAULT_PRESETS),
            undefined
          );
          const pattern = services.telegram.pattern(reposToPattern, {
            ...data,
            repos: data.repos || objectRepos,
            visualisation:
              data.visualisation || Types.Patterns.Formatting.DEFAULT_PRESETS.visualisation
          });

          const generated = pattern.generate();

          console.log(generated);

          return await interaction.reply(new FmtString(generated.text, generated.entities));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          await interaction.reply(
            getHelp("0000", "Error:\n" + error.stack || error.message || error)
          );
          await interaction.reply(
            "Однако после этого мы всё равно продолжим, использую наш стандартный шаблон"
          );

          try {
            const pattern = services.telegram.pattern(reposToPattern, {
              repos: objectRepos,
              visualisation: Types.Patterns.Formatting.DEFAULT_PRESETS.visualisation
            });

            const generated = pattern.generate();

            console.log(generated);

            return await interaction.reply(new FmtString(generated.text, generated.entities));
          } catch (err) {
            return await interaction.reply(`${err}`);
          }
        }
      }
    });
  }
}
