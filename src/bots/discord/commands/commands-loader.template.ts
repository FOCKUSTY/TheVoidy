import type { Command } from "../types/command.type";
import type { Callback, CallbackParameters, JsFilesLoader } from "@utility/services/loaders/js-files.loader";

export interface Commands {
  global: Map<string, Command>,
  guild: Map<string, Command>
}

export abstract class CommandsLoaderTemplate {
  public constructor(
    public readonly filesLoader: JsFilesLoader<Command>
  ) {}

  public abstract execute(): Promise<Commands>;
  
  protected abstract formatFiles: Callback<Command, Command>;
  protected abstract filterFiles: Callback<Command, boolean>;
}

export default CommandsLoaderTemplate;
