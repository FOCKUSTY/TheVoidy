/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Telegraf } from "telegraf";

import { env } from "@develop";
import { Services, TelegramInteraction } from "@types";

export const client = new Telegraf(env.TELEGRAM_TOKEN);

client.on("message", (interaction: TelegramInteraction) => {
  /* empty */
});

const login = async (services: Services) => {
  await client.launch();
};

export { login as loginTelegram };

export default client;
