import { CommandInteraction, ChatInputApplicationCommandData, Client } from "discord.js";

import { Context, NarrowedContext } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";

export interface DiscordCommand extends ChatInputApplicationCommandData {
  run: (client: Client, interaction: CommandInteraction) => void;
}

export type TelegramInteraction = NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>;
