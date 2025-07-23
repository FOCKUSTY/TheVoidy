/* eslint-disable */

import {
  CommandInteraction,
  InteractionReplyOptions,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from "discord.js";
import type { ModulesType } from "src/discord.bot";

type CommandBuilder =
  | SlashCommandBuilder
  | SlashCommandSubcommandBuilder
  | SlashCommandOptionsOnlyBuilder
  | SlashCommandSubcommandGroupBuilder
  | SlashCommandSubcommandsOnlyBuilder;

type NonFalse<T> = T extends false ? never : T;
type Modules = ModulesType & { commands: NonFalse<ModulesType["commands"]> };

export type CommandCreateData<T> = {
  name?: string;
  cooldown?: number;
  actived?: boolean;
  data: CommandBuilder;
  execute: (interaction: CommandInteraction, modules: Modules) => Promise<T | void>;
};

export interface CommandData<T> {
  readonly name: string;
  readonly data: CommandBuilder;
  readonly cooldown: number;
  readonly execute: (interaction: CommandInteraction, modules: Modules) => Promise<T | void>;
}

export class Command<T = void> {
  private readonly _error: InteractionReplyOptions = {
    content:
      "По какой-то причине у данной команды не было записано функции для её исполенения.\n" +
      "Если Вы видите это сообщение, срочно обратитесь к нам: https://discord.gg/5MJrRjzPec",
    flags: MessageFlags.Ephemeral
  };
  public readonly data: CommandBuilder;
  public readonly cooldown: number = 5;
  public readonly actived: boolean = true;
  public readonly name: string;

  public constructor(data: CommandCreateData<T>) {
    this.data = data.data;
    this.name = data.name || data.data.name;
    this.cooldown = data.cooldown || 5;
    this.execute = data.execute;
  }

  private async init(interaction: CommandInteraction, modules: Modules): Promise<T | void> {
    await interaction.reply(this._error);
  }

  public get execute(): (interaction: CommandInteraction, modules: Modules) => Promise<T | void> {
    return this.init;
  }

  public set execute(
    execute: (interaction: CommandInteraction, modules: Modules) => Promise<T | void>
  ) {
    this.init = execute;
  }
}

export abstract class Subcommand<T> {
  public static readonly subcommand: SlashCommandSubcommandBuilder;

  public abstract execute: (interaction: CommandInteraction, modules: Modules) => Promise<T>;
}

export abstract class SubcommandsInitializer<T> {
  public abstract readonly name: string;

  public abstract readonly subcommands: {
    [name: string]: typeof Subcommand<T>;
  };

  public abstract execute: (interaction: CommandInteraction, modules: Modules) => Promise<T>;
}

export default Command;

export type DeployCommands = Map<string, Command>;
