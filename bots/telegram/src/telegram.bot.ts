import { Env } from "@voidy/develop";

import { Telegraf } from "telegraf";
import { Types } from "@voidy/types";

import Deployer from "./deploy.commands";

import MessageListener from "./events/message.listener";
import SlashCommandsListener from "./events/slash-commands.listener";

import path from "path";
import fs from "fs";

const Client = new Telegraf(Env.get("TELEGRAM_TOKEN"));

Client.on("message", async (message: Types.Telegram.Interaction) => {
  SlashCommandsListener(message);
  MessageListener(message);
});

const fileType: ".ts" | ".js" = Env.env.NODE_ENV === "prod" ? ".js" : ".ts";

const Login = async (services: Types.Services) => {
  const commandsPath = path.join(__dirname, "commands");
  const commandsFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(fileType) && !file.endsWith(".d.ts"));

  new Deployer(services).execute(Client, commandsPath, commandsFiles);

  await Client.launch();

  process.once("SIGINT", () => Client.stop("SIGINT"));
  process.once("SIGTERM", () => Client.stop("SIGTERM"));
};

export { Login as LoginTelegram };

export default Client;
