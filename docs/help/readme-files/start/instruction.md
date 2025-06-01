# Инструкция
## Инструкция по запуску бота и главным файлам

- У нас есть папка `src` в которой содержаться файлы, папки пока трогать не будем.
- На данный момент у нас 5 файлов.
1. `discord.bot.ts`
2. `telegram.bot.ts`
3. `index.config.ts`
4. `index.constants.ts`
5. `start.bot.ts`

### discord.bot.ts
- В этом файле содержиться сам бот и его код.
- Детально разбирать каждый файл не буду, чем больше файлов буду разбирать, тем меньше буду писать комментариев.
- Разберем код:
```ts
// Импорт Env из самописнового модуля для работы с .env файлами
// Debug - Объект-помощник для отладки
import { Env, Debug } from "@voidy/develop";

// Импорт методов и объектов
// ICL - Объект-прослушиватель для использования пользователями slash команд
// ML - Объект-послушиватель для использования пользовательми модальников
import ICL from "./events/interaction-create.listener";
import ML from "./events/modal.listener";

// Импорт функций для установки команд бота
// Deployer - Объект-помощник для работы с деплоем команд (и не только)
// DeployEvents - Загрузчик событий
import Deployer from "./deploy.commands";
import DeployEvents from "./deploy.events";

// Импорт дополнительного материала
// Services - Все типы сервисов, которые у нас есть (discord, telegram)
import { Services } from "@voidy/types/all/services.type";

// Импорт модулей из node.js для просмотра файлов и папок
// path - помогает найти путь до файлов/папок
// fs - читает файлы/папки
import path from "path";
import fs from "fs";

// Испорт главный модулей и типов
import {
	Client as DiscordClient,
	Collection,
	Events,
	GatewayIntentBits,
	Partials
} from "discord.js";

// Установка клиента
const Client = new DiscordClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences
	],
	partials: [Partials.Channel]
});

// Установка коллекций команд и кулданоунов
const Commands = new Collection();
const Cooldowns = new Collection();

// Определения типа файлов
const fileType: ".ts" | ".js" = Env.get<false>("NODE_ENV") === "prod" ? ".js" : ".ts";

// Логиним нашего бота
const Login = async (clientToken: string, services: Services) => {
    // Чтение папки с командами
	const foldersPath = path.join(__dirname, "commands");
	const commandsFolder = fs.readdirSync(foldersPath);

    // Чтение папки с событиями
	const eventsPath = path.join(__dirname, "events");
	const eventFiles = fs
		.readdirSync(eventsPath)
		.filter((file) => file.endsWith(fileType));

    // Создание прослушиватель
	const modalListener = new ML(services);
	const interactionListener = new ICL();

	// Прослушиватель взаимодействия
	Client.on(Events.InteractionCreate, async (interaction) => {
		interactionListener.execute(interaction, Commands, Cooldowns);
		modalListener.execute(interaction);
	});

    // Установка загрузчиков
	new Deployer(foldersPath, commandsFolder).write(Client, Commands);
	new DeployEvents(eventsPath, eventFiles, services).execute();

    // Вход
	await Client.login(clientToken).catch((e) => Debug.Error(e));
};

// Экспорт
export { Commands, Login as LoginDiscord };

export default Client;
```
### telegram.bot.ts

```ts
import { Env } from "@voidy/develop";

// Импортируем главный модуль
import { Telegraf } from "telegraf";

// Импортируем самописный тип взаимодействия
import type { Interaction } from "@voidy/types/telegram/interaction.type";

// Deployer - Наш объявитель команд, props - тип команд
import Deployer, { Props } from "./deploy.commands";

// Импорт функций-прослушивателей
import MessageListener from "./events/message.listener";
import SlashCommandsListener from "./events/slash-commands.listener";

import path from "path";
import fs from "fs";

const Client = new Telegraf(process.env.TELEGRAM_TOKEN || "");

Client.on("message", async (message: Interaction) => {
	SlashCommandsListener(message);
	MessageListener(message);
});

const fileType: ".ts" | ".js" = Env.get<false>("NODE_ENV") === "prod" ? ".js" : ".ts";

const Login = async (services: Props) => {
	const commandsPath = path.join(__dirname, "commands");
	const commandsFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(fileType));

	new Deployer(services).execute(Client, commandsPath, commandsFiles);

	await Client.launch();

	process.once("SIGINT", () => Client.stop("SIGINT"));
	process.once("SIGTERM", () => Client.stop("SIGTERM"));
};

export { Login as LoginTelegram };

export default Client;
```
### index.config.ts

```ts
// Импорт и экспорт настроек для бота
import settings from "../settings.json";

export { settings };
```
### index.constant.ts

```ts
// Импорт инциализатора
import { loaders } from "@thevoidcommunity/the-void-database";
import { version } from "../package.json";

const { Constants } = loaders;

const THEVOIDs_CONSTANTS: { [key: string]: string } = {
	"THEVOIDSBOT_REVERSE_GENDER": "девушка",
	"THEVOIDSBOT_NREVERSE": "The Void",
	"THEVOIDSBOT_REVERSE": "The Abyssia",
	"THEVOIDSBOT_LOVE": "Kristy",
	"THEVOIDSBOT_REVERSE_LOVE": "The Void",
	"THEVOID_LOVE": "Kristy",
	"THEVOID": "Меня",
	"typend_A": "",
	"typend_B": "ым",
	"version": version
};

new Constants(THEVOIDs_CONSTANTS).execute();

export { THEVOIDs_CONSTANTS };
```
### start.bot.ts
```ts
import { Env, Debug } from "@voidy/develop";

// Инициализация констант
import "src/index.constants";

import Logger from "fock-logger";
import Formatter, { Colors } from "f-formatter";

import loggers from "./loggers.names";
import { Debug } from "@voidy/develop/debug.develop";

import { LoginDiscord } from "@voidy/discord/dist/src/discord.bot";
import { LoginTelegram } from "@voidy/telegram/dist/telegram.bot";

import Llama from "./utility/llama.ai";
import GitHubApi from "./utility/laf/github.utility";
import DiscordService from "@voidy/discord/dist/src/utility/service/discord.service";
import TelegramService from "@voidy/telegram/dist/utility/service/telegram.service";

Debug.Console.clear();
Debug.Log([new Formatter().Color("Начало программы", Colors.magenta)]);

// Объявления среды запуска BOT (Может быть 'discrod'|'telegram'|'all')
const bot = Env.get<false>("BOT") || "all";

new Loggers().execute();

// анонимная асинхронная функция
(async () => {
	const services = {
		discord: new DiscordService(),
		telegram: new TelegramService(),
		llama: new Llama(),
		github: new GitHubApi()
	};

	switch (bot) {
		case "discord":
			LoginDiscord(Env.get("CLIENT_TOKEN"), services);
			break;

		case "telegram":
			LoginTelegram(services);
			break;

		default:
			LoginDiscord(Env.get("CLIENT_TOKEN"), services);
			LoginTelegram(services);
			break;
	}
})();
```

- Хотелось бы еще расмотреть скрипты в `package.json`.
### package.json > scripts
```json
"scripts": {
    "dev:slash": "nodemon src/discord/slash.commands.ts",
    "dev": "set NODE_ENV=dev&& set BOT=all&& nodemon src/start.bot.ts",
    "dev:telegram": "set NODE_ENV=dev&& set BOT=telegram&& nodemon src/start.bot.ts",
    "dev:discord": "set NODE_ENV=dev&& set BOT=discord&& nodemon src/start.bot.ts",
    "start:slash": "node -r tsconfig-paths/register dist/src/discord/slash.commands.js",
    "start:builded": "set NODE_ENV=prod&& set BOT=all&& node -r tsconfig-paths/register dist/src/start.bot.js",
    "start": "set NODE_ENV=prod&& pnpm run build && pnpm run start:slash && pnpm run start:builded",
    "build": "tsc"
}
```

1. `dev:slash`
- Запуск обновления slash-команд
2. `dev`
- Запуск бота в среде `dev`
3. `dev:telegram`
- Запуск телеграм-бота в среде `dev`
4. `dev:discord`
- Запуск дискорд-бота в среде `dev`
5. `start:slash`
- Запуск обновления slash-команд
6. `start:builded`
- Запуск скомпилированного кода
7. `start`
- Запуск компилятора и скомпилированного кода
8. `build`
- Запуск компиляции

- Рассмотрим команды, используемые в скриптах.
1. `nodemon` - Запуск чистого `ts` кода.
2. `set NODE_ENV` - Установка в `.env` `NODE_ENV` (Значение указывается через `=ЗНАЧЕНИЕ`).
3. `set BOT` - Тоже самое, что и `NODE_ENV`.
4. `&&` - Логическое "И", помогает запускать несколько скриптов в одном.
5. `tsc` - Запуск компилятора.
6. `-r tsconfig-paths/register` - Что-то с путями, крутая штука

- Думаю, вопросов больше не возникнет.
- Вы можете сами разобрать код в папка, сложнее всего будет понять:
`discord`
`telegram`
`utility`
 
- Удачи, счастливого взлома!