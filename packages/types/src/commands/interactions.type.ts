/* eslint-disable */

import { CommandInteraction, ChatInputApplicationCommandData, Client } from "discord.js";

import { Context, NarrowedContext } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

export interface DiscordCommand extends ChatInputApplicationCommandData {
  run: (client: Client, interaction: CommandInteraction) => void;
}

export type TelegramInteraction<T extends Context = any, K extends Update = any> =
  | Context
  | NarrowedContext<T, K>;
