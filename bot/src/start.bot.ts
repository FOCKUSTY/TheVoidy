import "v@develop";

import { Env, Debug } from "v@develop";

import "src/index.constants";

import Formatter, { Colors } from "f-formatter";

import Loggers from "./loggers.names";

import { LoginDiscord } from "v@discord/discord.bot";
import { LoginTelegram } from "v@telegram/telegram.bot";

import Ai from "./utility/ai";
import GitHubApi from "./utility/laf/github.utility";
import DiscordService from "v@discord/utility/service/discord.service";
import TelegramService from "v@telegram/utility/service/telegram.service";

Debug.Console.clear();
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
