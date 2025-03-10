import { Types } from "v@types";

type Command<T, K> = Types.Telegram.CommandData<T, K>;

class Commands<T = unknown, K = unknown> {
  private readonly _commands: string[] = [];
  private readonly _full_commands: Command<T, K>[] = [];

  public setCommand(command: Command<T, K>) {
    this._full_commands.push(command);
  }

  public set commands(name: string) {
    this._commands.push(name);
  }

  public get fullCommands(): Command<T, K>[] {
    return this._full_commands;
  }

  public get commands(): string[] {
    return this._commands;
  }
}

export default new Commands();
