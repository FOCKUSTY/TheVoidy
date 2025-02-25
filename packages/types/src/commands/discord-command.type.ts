/* eslint-disable */

import { CommandInteraction, SlashCommandOptionsOnlyBuilder } from "discord.js";

export type CommandCreateData<T> = {
  name?: string;
  cooldown?: number;
  data: SlashCommandOptionsOnlyBuilder;
  execute: (interaction: CommandInteraction) => Promise<T | void>;
};

export interface CommandData<T> {
  readonly name: string;
  readonly data: SlashCommandOptionsOnlyBuilder;
  readonly cooldown: number;
  readonly execute: (interaction: CommandInteraction) => Promise<T | void>;
}

class Command<T = void> {
  private readonly _error = {
    content:
      "По какой-то причине у данной команды не было записано функции для её исполенения.\n" +
      "Если Вы видите это сообщение, срочно обратитесь к нам: https://discord.gg/5MJrRjzPec",
    ephemeral: true
  };
  public readonly data: SlashCommandOptionsOnlyBuilder;
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

export default Command;
