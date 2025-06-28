/* eslint-disable */

import {
  CacheType,
  CommandInteraction,
  InteractionReplyOptions,
  MessageFlags,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from "discord.js";

type CommandBuilder = 
  | SlashCommandBuilder
  | SlashCommandSubcommandBuilder
  | SlashCommandOptionsOnlyBuilder
  | SlashCommandSubcommandGroupBuilder
  | SlashCommandSubcommandsOnlyBuilder;

export type CommandCreateData<T> = {
  name?: string;
  cooldown?: number;
  data: CommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<T | void>;
};

export interface CommandData<T> {
  readonly name: string;
  readonly data: CommandBuilder;
  readonly cooldown: number;
  readonly execute: (interaction: CommandInteraction) => Promise<T | void>;
}

class Command<T = void> {
  private readonly _error: InteractionReplyOptions = {
    content:
      "По какой-то причине у данной команды не было записано функции для её исполенения.\n" +
      "Если Вы видите это сообщение, срочно обратитесь к нам: https://discord.gg/5MJrRjzPec",
    flags: MessageFlags.Ephemeral
  };
  public readonly data: CommandBuilder;
  public readonly cooldown: number = 5;
  public readonly name: string;

  public constructor(data: CommandCreateData<T>) {
    this.data = data.data;
    this.name = data.name || data.data.name;
    this.cooldown = data.cooldown || 5;
    this.execute = data.execute;
  }

  private async init(interaction: CommandInteraction): Promise<T | void> {
    await interaction.reply(this._error);
  }

  public get execute(): (interaction: CommandInteraction) => Promise<T | void> {
    return this.init;
  }

  public set execute(execute: (interaction: CommandInteraction) => Promise<T | void>) {
    this.init = execute;
  }
}

export abstract class Subcommand<T> {
  public static readonly name: string;
  public static readonly options: {
    [key: string]: {
      name: string,
      description: string
      required: boolean
    }
  };

  public execute: (interaction: CommandInteraction) => Promise<T>;
};

export abstract class SubcommandsInitializer<T> {
  public readonly name: string;

  public readonly subcommands: {
    [name: string]: new (interaction: CommandInteraction<CacheType>) => Subcommand<T>
  };


  public execute: (interaction: CommandInteraction) => Promise<T>;
};

export default Command;
