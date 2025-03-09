/* eslint-disable */

import { TelegramInteraction as Interaction } from "../commands/interactions.type";

export type Props<T = any, K = any> = {
  name: string;
  options?: string[];
  execute: (interaction: Interaction) => Promise<any>;
  executeFunc?: (...data: T[]) => K;
};

class Command<T = any, K = any> {
  private readonly _error =
    "По какой-то причине у данной команды не было записано функции для её исполенения.\n" +
    "Если Вы видите это сообщение, срочно обратитесь к нам: https://discord.gg/5MJrRjzPec";

  public readonly name: string = "ERROR_NO_NAME";
  public readonly options: string[] = [];
  public readonly executeFunc: (...data: T[]) => K;
  public readonly execute: (interaction: Interaction) => Promise<any> = async (
    interaction: Interaction
  ) => {
    return await interaction.reply(this._error);
  };

  public constructor(data: Props<T, K>) {
    this.name = data.name;
    this.options = data.options || [];
    this.execute = data.execute;
    this.executeFunc = data.executeFunc;
  }
}

export default Command;
