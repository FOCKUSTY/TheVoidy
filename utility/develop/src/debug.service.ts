/* eslint-disable */

import Env from "./env.service";
import Logger from "./logger.service";

const warn = "\n------------- !Внимание! --------------\n";
const toString = <T = unknown>(data: T) => JSON.stringify(data, undefined, 2);

class Debug {
  private static readonly _log: Logger<"Debugger"> = new Logger("Debugger", {
    write: true,
    prefix: "debug",
    level: "info"
  });

  private static readonly _error: Logger<"Errorer"> = new Logger("Errorer", {
    write: true,
    prefix: "error",
    level: "err"
  });

  private static readonly _warn: Logger<"Warner"> = new Logger("Warner", {
    write: true,
    prefix: "warn",
    level: "warn"
  });

  public static readonly Console = console;

  private static readonly WarnComponent = <T extends string | Error | unknown = string>(
    msg: T | T[],
    type: "error" | "warn"
  ) => {
    const logger = `_${type}` as `_${typeof type}`;
    const error: T[] = Array.isArray(msg) ? msg : [msg];

    const text = error
      .map((err) =>
        warn
        + (err instanceof Error ? err.stack || err.message : err)
        + warn
      )
      .join("\n");

    this[logger].execute(text);

    return text;
  };

  public static readonly Log = <T extends string | Error | unknown = unknown>(
    message: T|T[],
    enabled?: boolean,
    trace?: boolean
  ): void => {
    message = (Array.isArray(message) ? message : [message]);
    
    if ((enabled || Env.data.DEVELOP_MODE === "true") && !trace) this._log.execute(message);

    if (trace) {
      const text = message
        .map((msg) =>
          msg instanceof Error
            ? msg.stack || msg.message
            : typeof msg === "string"
              ? new Error(msg).stack || msg
              : toString(msg)
        )
        .join("\n");

      this._log.execute(text);
      this._log.write(text);
    }
  };

  public static readonly Trace = () => {
    console.trace();
  };

  public static readonly Error = <T extends string | Error | unknown = string>(error?: T | T[]) => {
    if (!error) return "no error there";

    if (!(error instanceof Error) && typeof error !== "string")
      return "your error is not error or string";

    return this.WarnComponent<T>(error, "error");
  };

  public static readonly Warn = <T extends string | Error | unknown = string>(msg?: T | T[]) => {
    if (!msg) return "no msg there";

    if (!(msg instanceof Error) && typeof msg !== "string")
      return "your msg is not error or string";

    return this.WarnComponent<T>(msg, "warn");
  };
}

export { Debug };
