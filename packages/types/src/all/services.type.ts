/* eslint-disable */

import { Service as Telegram } from "../telegram/service.type";
import { Service as Discord } from "../discord/service.type";
import { Ai } from "./ai-service.type";

export type Services<T extends { [key: string]: unknown } = {}> = {
  discord: Discord;
  telegram: Telegram;
  ai: Ai;
} & T;
