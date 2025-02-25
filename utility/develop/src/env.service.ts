/* eslint-disable */

import { config } from "dotenv";
import { join } from "path";

config({ path: join(__filename, "../../../../.env") });

const data = {
  CLIENT_TOKEN: process.env.CLIENT_TOKEN!,
  CLIENT_ID: process.env.CLIENT_ID!,
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN!,
  IDEA_CHANNEL_ID: process.env.IDEA_CHANNEL_ID!,
  CHANGELOG_TELEGRAM_CHANNEL_ID: process.env.CHANGELOG_TELEGRAM_CHANNEL_ID!,
  CHANGELOG_DISCORD_CHANNEL_ID: process.env.CHANGELOG_DISCORD_CHANNEL_ID!,
  GUILD_ICON_URL: process.env.GUILD_ICON_URL! || "",
  GUILD_ID: process.env.GUILD_ID!,
  AUTHOR_ID: process.env.AUTHOR_ID!,
  FRIEND_ID: process.env.FRIEND_ID! || "",

  OPEN_AI_KEY: process.env.OPEN_AI_KEY!
} as const;

const dynamicData = {
  BOT: process.env.BOT,
  NODE_ENV: process.env.NODE_ENV
};

type DynamicType = keyof typeof dynamicData;
type EnvType = keyof typeof data;
const envKeys = Object.keys(data);

class Env {
  public static readonly data = process.env;
  public readonly data = process.env;

  public static get<T extends boolean | string = true>(
    name: T extends string ? string : T extends true ? EnvType : DynamicType
  ): T extends string ? string | undefined : T extends true ? string : string | undefined {
    if (envKeys.includes(name) && process.env[name] === undefined)
      throw new Error("ENV ERROR:\nValue at key: " + name + " is undefined");

    return process.env[name]! as any;
  }

  public get<T extends boolean | string = true>(
    name: T extends string ? string : T extends true ? EnvType : DynamicType
  ): T extends string ? string | undefined : T extends true ? string : string | undefined {
    if (envKeys.includes(name) && process.env[name] === undefined)
      throw new Error("ENV ERROR:\nValue at key: " + name + " is undefined");

    return process.env[name]! as any;
  }
}

export default Env;
