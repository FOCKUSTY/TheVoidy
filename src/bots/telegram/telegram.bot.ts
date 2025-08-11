import { Env } from "@develop";

import { Telegraf } from "telegraf";
import { Services } from "@types";

import Deployer from "./deploy.commands";

import MessageListener from "./events/message.listener";
import SlashCommandsListener from "./events/slash-commands.listener";

import { Interaction } from "./types/interaction.type";

import path from "path";
import fs from "fs";

const Client = new Telegraf(Env.get("TELEGRAM_TOKEN"));

Client.on("message", async (message: Interaction) => {
  SlashCommandsListener(message);
  MessageListener(message);
});

const fileType: ".ts" | ".js" = Env.env.NODE_ENV === "prod" ? ".js" : ".ts";

const Login = async (services: Services) => {
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
