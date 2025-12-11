import { CallbackParameters, JsFilesLoader } from "@utility/services/loaders/js-files.loader";
import Command from "../types/command.type";
import { env } from "@develop";
import CommandsLoaderTemplate from "./commands-loader.template";

interface Commands {
  global: Map<string, Command>,
  guild: Map<string, Command>
}

const FILE_EXTENSIONS = {
  TYPESCRIPT_DEFINITION: ".d.ts",
  COMMANDS_FILE: ".commands"
} as const;
const LOGGER_TYPES = {
  COMMANDS: "Commands",
  UPDATER: "Updater"
} as const;
const UPDATE_MESSAGES = {
  GLOBAL: {
    START: "Начало обновления глобальных (/) команд",
    SUCCESS: "Успешно обновлены глобальные (/) команды"
  },
  GUILD: {
    START: "Начало обновления (/) команд гильдии",
    SUCCESS: "Успешно обновлены (/) команды гильдии"
  }
} as const;

export class CommandsLoader extends CommandsLoaderTemplate {
  public constructor() {
    super(new JsFilesLoader("./"));
  }

  public async execute(): Promise<Commands> {
    const data = this.filesLoader.execute<Command>(this.formatFiles, this.filterFiles)
    
    console.log(data);

    return data as unknown as Commands;
  }

  protected formatFiles = ({ path }: CallbackParameters<Command>): Command => {
    return require(path).default;
  }

  protected filterFiles = ({ path }: CallbackParameters<Command>): boolean => {
    return path.endsWith(`${FILE_EXTENSIONS.COMMANDS_FILE}.${env.FILE_TYPE}`) && !path.endsWith(FILE_EXTENSIONS.TYPESCRIPT_DEFINITION);
  }
}

(async () => {
  await new CommandsLoader().execute();
})();

export default CommandsLoader;
