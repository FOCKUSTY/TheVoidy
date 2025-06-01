import { Env, Debug } from "@voidy/develop";

import "src/index.constants";

import Formatter, { Colors } from "f-formatter";

import Loggers from "./loggers.names";

import { LoginDiscord } from "@voidy/discord";
import { LoginTelegram } from "@voidy/telegram";

import Ai from "./utility/ai";
import GitHubApi from "./utility/github/github.utility";
import DiscordService from "@voidy/discord/dist/utility/service/discord.service";
import TelegramService from "@voidy/telegram/dist/utility/service/telegram.service";

Debug.Console.clear();
Debug.Log([new Formatter().Color("Начало программы", Colors.magenta)]);

const bot = Env.env.BOT || "all";

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
