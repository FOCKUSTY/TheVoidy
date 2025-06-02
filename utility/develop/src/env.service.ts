/* eslint-disable */

import { config } from "dotenv";
import { join } from "path";

config({ path: join(__filename, "../../../../.env") });

const REQUIRED = [
  "CLIENT_TOKEN",
  "CLIENT_ID",
  "TELEGRAM_TOKEN",
  "IDEA_CHANNEL_ID",
  "GUILD_ID",
  "AUTHOR_ID",
  "CHANGELOG_DISCORD_CHANNEL_ID",
  "CHANGELOG_TELEGRAM_CHANNEL_ID",
  "TELEGRAM_TEAM_IDS"
] as const;
type Required = (typeof REQUIRED)[number];

const ALL = [...REQUIRED, "OPEN_AI_KEY", "FRIEND_ID"] as const;

type All = (typeof ALL)[number];
type PartialKeys = Exclude<All, Required>;

const DEFAULT: Partial<Record<PartialKeys, string>> = {};

type UniversalEnv<T extends boolean = true> = T extends true ? Required : PartialKeys;

const DYNAMIC = ["BOT", "NODE_ENV", "DEVELOP_MODE"] as const;
type Dynamic = (typeof DYNAMIC)[number];

type IEnv = Record<Required, string> &
  Record<PartialKeys, string | false> &
  Record<Dynamic, string>;

const ENV: IEnv = (() => {
  return Object.fromEntries(
    ALL.map((key) => {
      if (!process.env[key] && REQUIRED.includes(key as any))
        throw new Error(`key: ${key} in .env is undefined, but must be define`);

      return [key, process.env[key] || DEFAULT[key]];
    })
  ) as IEnv;
})();

class Env {
  public static readonly lazy = process.env;
  public static readonly env = { ...process.env, ...ENV } as IEnv;
  public readonly lazy = process.env;
  public readonly env = { ...process.env, ...ENV } as IEnv;

  public constructor() {}

  public static get<T extends boolean = true>(key: UniversalEnv<T>) {
    return (this.env[key] || false) as T extends true ? string : string | false;
  }

  public get<T extends boolean = true>(key: UniversalEnv<T>) {
    return (this.env[key] || false) as T extends true ? string : string | false;
  }
}

export { Env };

export default Env;
