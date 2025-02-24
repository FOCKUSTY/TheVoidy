import "@voidy/develop";

import { Env, Debug } from "@voidy/develop/dist";

import "src/index.constants";

import Formatter, { Colors } from "f-formatter";

import Loggers from "./loggers.names";

import { LoginDiscord } from "@voidy/discord/dist/discord.bot";
import { LoginTelegram } from "@voidy/telegram/dist/telegram.bot";

import Ai from "./utility/ai";
import GitHubApi from "./utility/laf/github.utility";
import DiscordService from "@voidy/discord/dist/utility/service/discord.service";
import TelegramService from "@voidy/telegram/dist/utility/service/telegram.service";

// Debug.Console.clear();
Debug.Log([new Formatter().Color("Начало программы", Colors.magenta)]);

const bot = Env.get<false>("BOT") || "all";

new Loggers().execute();

(async () => {
	const services = {
		discord: new DiscordService(),
		telegram: new TelegramService(),
		ai: new Ai(),
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
