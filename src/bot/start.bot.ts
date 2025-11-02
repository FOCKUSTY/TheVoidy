import { Env, Debug } from "@develop";

import "./index.constants";

import Formatter, { Colors } from "f-formatter";

import Loggers from "./loggers.names";

import { LoginDiscord } from "@discord/discord.bot";
import { LoginTelegram } from "@telegram/telegram.bot";

import Ai from "./utility/ai";

import DiscordService from "@discord/utility/service/discord.service";
import TelegramService from "@telegram/utility/service/telegram.service";

import connect from "@thevoidcommunity/the-void-database/database/connection";

connect(Env.env.MONGOOSE_URL);

Debug.Log([new Formatter().Color("Начало программы", Colors.magenta)]);

const bot = Env.env.BOT || "all";

new Loggers().execute();

(async () => {
  const services = {
    discord: new DiscordService(),
    telegram: new TelegramService(),
    ai: new Ai(),
  };

  switch (bot) {
    case "discord":
      LoginDiscord(Env.env.CLIENT_TOKEN, services);
      break;

    case "telegram":
      LoginTelegram(services);
      break;

    default:
      LoginDiscord(Env.env.CLIENT_TOKEN, services);
      LoginTelegram(services);
      break;
  }
})();
