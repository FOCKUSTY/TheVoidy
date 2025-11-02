import { Telegraf } from "telegraf";

import { env } from "@develop";
import { Services, TelegramInteraction } from "@types";

import path from "path";
import fs from "fs";

const client = new Telegraf(env.TELEGRAM_TOKEN);

client.on("message", (interaction: TelegramInteraction) => {
  /* empty */
});
