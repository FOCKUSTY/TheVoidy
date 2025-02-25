import { Colors, Logger } from "v@develop";

type Names =
  | "TheVoid"
  | "Commands"
  | "Updater"
  | "Activity"
  | "Events"
  | "Loader"
  | "Fail"
  | "Debugger"
  | "Errorer"
  | "Warner";

const loggers: Record<string, { name: Names; colors: [Colors, Colors] }> = {
  TheVoid: { name: "TheVoid", colors: [Colors.red, Colors.magenta] },
  Commands: { name: "Commands", colors: [Colors.brightYellow, Colors.green] },
  Updater: { name: "Updater", colors: [Colors.brightYellow, Colors.yellow] },
  Activity: { name: "Activity", colors: [Colors.brightRed, Colors.green] },
  Events: { name: "Events", colors: [Colors.brightYellow, Colors.green] },
  Loader: { name: "Loader", colors: [Colors.brightYellow, Colors.red] },
  Fail: { name: "Fail", colors: [Colors.red, Colors.red] },
  Debugger: { name: "Debugger", colors: [Colors.cyan, Colors.magenta] },
  Errorer: { name: "Errorer", colors: [Colors.red, Colors.red] },
  Warner: { name: "Warner", colors: [Colors.yellow, Colors.magenta] }
};

class Loggers {
  private readonly _loggers: Logger<Names>[] = [];

  public constructor() {
    this.init();
  }

  private init() {
    for (const name in loggers) {
      this._loggers.push(new Logger<Names>(loggers[name].name, { colors: loggers[name].colors }));
    }
  }

  public execute() {
    for (const logger of this._loggers) {
      logger.execute(`Hello, I'm ${logger.name}!`);
    }
  }

  public get loggers(): Logger<Names>[] {
    return this._loggers;
  }
}

export default Loggers;
