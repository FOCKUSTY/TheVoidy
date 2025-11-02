import { Colors, Logger } from "@develop";

export type Names =
  | "TheVoid"
  | "Commands"
  | "Updater"
  | "Activity"
  | "Events"
  | "Loader"
  | "Fail"
  | "Debugger"
  | "Errorer"
  | "Warner"
  | "Deployer";

export const loggers: Record<string, { name: Names; colors: [Colors, Colors] }> = {
  TheVoid: { name: "TheVoid", colors: [Colors.red, Colors.magenta] },
  Commands: { name: "Commands", colors: [Colors.brightYellow, Colors.green] },
  Updater: { name: "Updater", colors: [Colors.brightYellow, Colors.yellow] },
  Activity: { name: "Activity", colors: [Colors.brightRed, Colors.green] },
  Events: { name: "Events", colors: [Colors.brightYellow, Colors.green] },
  Loader: { name: "Loader", colors: [Colors.brightYellow, Colors.red] },
  Fail: { name: "Fail", colors: [Colors.red, Colors.red] },
  Debugger: { name: "Debugger", colors: [Colors.cyan, Colors.magenta] },
  Errorer: { name: "Errorer", colors: [Colors.red, Colors.red] },
  Warner: { name: "Warner", colors: [Colors.yellow, Colors.magenta] },
  Deployer: { name: "Deployer", colors: [Colors.brightYellow, Colors.cyan] }
};

type MyLogger = Logger<Names, string>;

class Loggers {
  private readonly _loggers: MyLogger[] = [];

  public constructor() {
    this.init();
  }

  private init() {
    for (const name in loggers) {
      this._loggers.push(
        <MyLogger>new Logger(loggers[name].name, { colors: loggers[name].colors })
      );
    }
  }

  public execute() {
    for (const logger of this._loggers) {
      logger.execute(`Hello, I'm ${logger.name}!`);
    }
  }

  public get loggers(): MyLogger[] {
    return this._loggers;
  }
}

export default Loggers;
