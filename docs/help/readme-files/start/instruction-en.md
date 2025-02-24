# Instructions
## Instructions for launching the bot and main files

- We have a `src` folder that contains files, we will not touch the folders for now.
- At the moment we have 5 files.
1. `discord.bot.ts`
2. `telegram.bot.ts`
3. `index.config.ts`
4. `index.constants.ts`
5. `start.bot.ts`

### discord.bot.ts
- This file contains the bot itself and its code.
- I will not analyze each file in detail, the more files I analyze, the less comments I will write.
- Let's analyze the code:

```ts
// Importing the configurator self-written module to work with .env files
// Debug - Объект-помощник для отладки
import { Env, Debug } from "v@develop";

// Importing methods and objects
// ICL - Listener object for slash commands to be used by users
// ML - Listener object for modal users to be used
import ICL from "./events/interaction-create.listener";
import ML from "./events/modal.listener";

// Importing functions for installing bot commands
// Deployer - Assistant object for working with command deployment (and not only)
// DeployEvents - Event loader
import Deployer from "./deploy.commands";
import DeployEvents from "./deploy.events";

// Import additional material
// Services - All types of services that we have (discord, telegram)
// Debug - Helper object for debugging
import { Services } from "v@types/all/services.type";

// Import modules from node.js for viewing files and folders
// path - helps find the path to files/folders
// fs - reads files/folders
import path from "path";
import fs from "fs";

// Import main modules and types
import {
    Client as DiscordClient,
    Collection,
    Events,
    GatewayIntentBits,
    Partials
} from "discord.js";

// Setting up the client
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

// Setting up command and cooldown collections
const Commands = new Collection();
const Cooldowns = new Collection();

// File type definitions
const fileType: ".ts" | ".js" = Env.get<false>("NODE_ENV") === "prod" ? ".js" : ".ts";

// Login our bot
const Login = async (clientToken: string, services: Services) => {
    // Read the commands folder
    const foldersPath = path.join(__dirname, "commands");
    const commandsFolder = fs.readdirSync(foldersPath);

    // Read the events folder
    const eventsPath = path.join(__dirname, "events");
    const eventFiles = fs
        .readdirSync(eventsPath)
        .filter((file) => file.endsWith(fileType));

    // Create a listener
    const modalListener = new ML(services);
    const interactionListener = new ICL();

    // Interaction Listener
    Client.on(Events.InteractionCreate, async (interaction) => {
        interactionListener.execute(interaction, Commands, Cooldowns);
        modalListener.execute(interaction);
    });

    // Install bootloaders
    new Deployer(foldersPath, commandsFolder).write(Client, Commands);
    new DeployEvents(eventsPath, eventFiles, services).execute();

    // Entrance
    await Client.login(clientToken).catch((e) => Debug.Error(e));
};

// Export
export { Commands, Login as LoginDiscord };

export default Client;
```
### telegram.bot.ts

```ts
import { Env } from "v@develop";

// Import the main module
import { Telegraf } from "telegraf";

// Import a custom interaction type
import type { Interaction } from "v@types/telegram/interaction.type";

// Deployer - Our command declarer, props - command type
import Deployer, { Props } from "./deploy.commands";

// Import listener functions
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
// Import and export settings for the bot
import settings from "../settings.json";

export { settings };
```
### index.constant.ts

```ts
// Import the initializer
import { loaders } from "@thevoidcommunity/the-void-database";
import { version } from "../package.json";

const { Constants } = loaders;

const THEVOIDs_CONSTANTS: { [key: string]: string } = {
    "THEVOIDSBOT_REVERSE_GENDER": "girl",
    "THEVOIDSBOT_NREVERSE": "The Void",
    "THEVOIDSBOT_REVERSE": "The Abyssia",
    "THEVOIDSBOT_LOVE": "Kristy",
    "THEVOIDSBOT_REVERSE_LOVE": "The Void",
    "THEVOID_LOVE": "Kristy",
    "THEVOID": "Me"
    "typend_A": "",
    "typend_B": "ym",
    "version": version
};

new Constants(THEVOIDs_CONSTANTS).execute();

export { THEVOIDs_CONSTANTS };
```

### start.bot.ts
```ts
import { Env, Debug } from "v@develop";

// Initialize constants
import "src/index.constants";

import Logger from "fock-logger";
import Formatter, { Colors } from "f-formatter";

import loggers from "./loggers.names";
import { Debug } from "v@develop/debug.develop";

import { LoginDiscord } from "@voidy/discord/dist/src/discord.bot";
import { LoginTelegram } from "@voidy/telegram/dist/telegram.bot";

import Llama from "./utility/llama.ai";
import GitHubApi from "./utility/laf/github.utility";
import DiscordService from "@voidy/discord/dist/src/utility/service/discord.service";
import TelegramService from "@voidy/telegram/dist/utility/service/telegram.service";

Debug.Console.clear();
Debug.Log([new Formatter().Color("Program Start", Colors.magenta)]);

// BOT launch environment declarations (May be 'discrod'|'telegram' |'all')
const bot = Env.get<false>("BOT") || "all";

new Loggers().execute();

// anonymous async function
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
            LoginTelegram(services );
            break;
    }
})();
```

- I would also like to look at the scripts in `package.json`.
### package.json > scripts
```json
"scripts": {
    "dev:slash": "nodemon src/discord/slash.commands.ts",
    "dev": "set NODE_ENV=dev&& set BOT=all&& nodemon src/start.bot.ts",
    "dev:telegram": "set NODE_ENV=dev&& set BOT=telegram&& nodemon src/start.bot.ts",
    "dev:discord": "set NODE_ENV=dev&& set BOT=discord&& nodemon src/start.bot.ts",
    "start:slash": "node -r tsconfig-paths/register dist/src/discord/slash.commands.js",
    "start:built": "set NODE_ENV=prod&& set BOT=all&& node -r tsconfig-paths/register dist/src/start.bot.js",
    "start": "set NODE_ENV=prod&& pnpm run build && pnpm run start:slash && pnpm run start:built",
    "build": "tsc"
}
```

1. `dev:slash`
- Launch slash command update
2. `dev`
- Launch bot in `dev` environment
3. `dev:telegram`
- Launch telegram bot in `dev` environment
4. `dev :discord`
- Start discord bot in `dev` environment
5. `start:slash`
- Start slash command update
6. `start:built`
- Start compiled code
7. `start`
- Start compiler and compiled code
8. `build`
- Start compilation

- Let's look at the commands used in scripts.
1. `nodemon` - Run pure `ts` code.
2. `set NODE_ENV` - Set `NODE_ENV` in `.env` (The value is specified via `=VALUE`).
3. `set BOT` - Same thing , as `NODE_ENV`.
4. `&&` - Logical "AND", helps to run several scripts in one.
5. `tsc` - Run the compiler.
6. `-r tsconfig-paths/register` - Something with ways, cool stuff

- I think there will be no more questions.
- You can parse the code in the folder yourself, the hardest thing will be to understand:
`discord`
`telegram`
`utility`

- Good luck, happy hacking!