/* eslint-disable @typescript-eslint/no-explicit-any */

/* 
  D{name} - Defaul import {name}
  IM{name} - Import {name}

  T{name} - Type {name}
  I{name} - Interface {name}

  E{name} - Enum {name}
  
  CL{name} - Class {name}
  ACL{name} - Abstact class {name}
  
  F{name} - Function {name}
  C{name} - Constant {name}
*/

import {
  ExecuteData as IMTExecuteData,
  Option as IMTOption,
  SendData as IMTSendData
} from "./base/options.type";
import { Response as IMTResponse } from "./base/response.type";

import { Ai as IMACLAi } from "./services/ai-service.type";
import { Service as IMACLDiscordService } from "./services/discord-service.type";
import { Service as IMACLTelegramService } from "./services/telegram-service.type";
import { Services as IMTServices } from "./services/services.type";

import DCLNewsPatternValidator, {
  DEFAULT_PRESETS as IMCDEFAULT_PRESETS,
  FORMATTING as IMCFORMATTING,
  VISUALISATION_ITEMS as IMCVISUALISATION_ITEMS,
  VISUALISATION_KEYS as IMCVISUALISATION_KEYS,
  Formatting as IMTFormatting,
  LazyPresets as IMILazyPresets,
  Presets as IMIPresets,
  FullPresets as IMTFullPresets,
  Repo as IMTRepo
} from "./services/news-pattern.type";

import {
  GitHubApi as IMACLGitHubApi,
  Repo as IMIGithubRepo,
  RepoOwners as IMTGithubRepoOwners,
  RepoReturn as IMTGithubRepoReturn,
  repoOwners as IMCGithubRepoOwners,
  Commit as IMIGithubCommit
} from "./services/github-api.type";
import { Time as IMTTime } from "./services/date.type";

export namespace Classes {
  export class NewsPatternValidator extends DCLNewsPatternValidator {}

  export abstract class Ai extends IMACLAi {}
  export abstract class DiscordService extends IMACLDiscordService {}
  export abstract class TelegramService extends IMACLTelegramService {}
  export abstract class GitHubApi extends IMACLGitHubApi {}
}

export namespace Types {
  export type Response<T = undefined> = IMTResponse<T>;
  export type Services<T extends { [key: string]: unknown } = { [key: string]: unknown }> =
    IMTServices<T>;
  export type Time = IMTTime;
}

export namespace Types.Patterns.Formatting {
  export const DEFAULT_PRESETS = IMCDEFAULT_PRESETS;
  export const FORMATTING = IMCFORMATTING;
  export const VISUALISATION_ITEMS = IMCVISUALISATION_ITEMS;
  export const VISUALISATION_KEYS = IMCVISUALISATION_KEYS;

  export class NewsPatternValidator extends DCLNewsPatternValidator {}

  export type FullPresets = IMTFullPresets;
  export type LazyPresets = IMILazyPresets;
  export type Presets = IMIPresets;
  export type Formatting = IMTFormatting;
  export type Repo = IMTRepo;
}

export namespace Types.Discord {
  export enum ActivityTypes {
    playing = 0,
    streaming = 1,
    listening = 2,
    watching = 3,
    custom = 4,
    competing = 5
  }

  export abstract class Service extends IMACLDiscordService {}
}

export namespace Types.Telegram {
  export type ExecuteData<Option, Response, ArgumentResponse = Response> = IMTExecuteData<
    Option,
    Response,
    ArgumentResponse
  >;

  export type Option<
    Response,
    FirstArgs extends unknown[] = unknown[],
    LastArgs extends unknown[] = unknown[],
    AddArgs extends unknown[] = unknown[],
    ArgumentResponse = Response
  > = IMTOption<Response, FirstArgs, LastArgs, AddArgs, ArgumentResponse>;

  export type SendData<Option, Response> = IMTSendData<Option, Response>;

  export abstract class Service extends IMACLTelegramService {}
}

export namespace Types.Github {
  export const REPO_OWNERS = IMCGithubRepoOwners;

  export type Repo = IMIGithubRepo;
  export type RepoOwners = IMTGithubRepoOwners;
  export type RepoReturn = IMTGithubRepoReturn;
  export type Commit = IMIGithubCommit;

  export abstract class Api extends IMACLGitHubApi {}
}
