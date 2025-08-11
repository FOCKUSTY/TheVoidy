import TelegramCommand from "./types/command.type";

class Commands<T = unknown, K = unknown> {
  private readonly _commands: string[] = [];
  private readonly _full_commands: TelegramCommand<T, K>[] = [];

  public setCommand(command: TelegramCommand<T, K>) {
    this._full_commands.push(command);
  }

  public set commands(name: string) {
    this._commands.push(name);
  }

  public get fullCommands(): TelegramCommand<T, K>[] {
    return this._full_commands;
  }

  public get commands(): string[] {
    return this._commands;
  }
}

export default new Commands();
