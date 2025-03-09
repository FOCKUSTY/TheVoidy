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
  ActivityTypes as IMEActivityTypes
} from "./base/activities.type";
import {
  ExecuteData as IMTExecuteData,
  Option as IMTOption,
  SendData as IMTSendData
} from "./base/options.type";
import {
  Response as IMTResponse
} from "./base/response.type";

import {
  Ai as IMACLAi
} from "./services/ai-service.type";
import {
  Service as IMACLDiscordService
} from "./services/discord-service.type";
import {
  Service as IMACLTelegramService
} from "./services/telegram-service.type";
import {
  Services as IMTServices
} from "./services/services.type";

import {
  GitHubApi as IMACLGitHubApi,
  Repo as IMIGithubRepo,
  RepoOwners as IMTGithubRepoOwners,
  RepoReturn as IMTGithubRepoReturn,
  repoOwners as IMCGithubRepoOwners
} from "./services/github-api.type";
import {
  Time as IMTTime
} from "./services/date.types";

import {
  DiscordCommand as IMIDiscordCommand,
  TelegramInteraction as IMTTelegramInteraction
} from "./commands/interactions.type";
import DCLDiscordCommand, {
  CommandCreateData as IMTDiscordCommandCreateData,
  CommandData as IMTDiscordCommandData
} from "./commands/discord-command.type";
import DCLTelegramCommand from "./commands/telegram-command.type";

export namespace Classes {
  export abstract class Ai extends IMACLAi {};
  export abstract class DiscordService extends IMACLDiscordService {};
  export abstract class TelegramService extends IMACLTelegramService {};
  export abstract class GitHubApi extends IMACLGitHubApi {};
  
  export class DiscordCommand extends DCLDiscordCommand {};
  export class TelegramCommand extends DCLTelegramCommand {};
}

export namespace Voidy {
  export type Response<T = undefined> = IMTResponse<T>;
  export type Services = IMTServices;
  export type Time = IMTTime;
}

export namespace Voidy.Discord {
  export type ActivityTypes = IMEActivityTypes;

  export type ICommand = IMIDiscordCommand;
  export type TCommandCreateData<T> = IMTDiscordCommandCreateData<T>;
  export type CommandData<T> = IMTDiscordCommandData<T>;

  export abstract class Service extends IMACLDiscordService {};
  export class Command extends DCLDiscordCommand {};
}

export namespace Voidy.Telegram {
  export type ExecuteData<
    Option,
    Response,
    ArgumentResponse = Response
  > = IMTExecuteData<Option, Response, ArgumentResponse>;

  export type Option<
    Response,
    FirstArgs extends unknown[] = unknown[],
    LastArgs extends unknown[] = unknown[],
    AddArgs extends unknown[] = unknown[],
    ArgumentResponse = Response
  > = IMTOption<Response, FirstArgs, LastArgs, AddArgs, ArgumentResponse>;

  export type SendData<Option, Response> = IMTSendData<Option, Response>;
  export type Interaction = IMTTelegramInteraction;

  export abstract class Service extends IMACLTelegramService {};
  export class Command extends DCLTelegramCommand {};
}

export namespace Voidy.Github {
  export const REPO_OWNERS = IMCGithubRepoOwners;

  export type Repo = IMIGithubRepo;
  export type RepoOwners = IMTGithubRepoOwners;
  export type RepoReturn = IMTGithubRepoReturn;

  export abstract class Api extends IMACLGitHubApi {};
}