/* eslint-disable */

import Env from "./env.service";
import Logger from "./logger.service";

const warn = "------------- !Внимание! --------------";

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

	private static readonly WarnComponent = <T extends string | Error = string>(
		msg: T | T[],
		type: "error" | "warn"
	) => {
		const error: Error | string = Array.isArray(msg) ? msg.join(" ") : msg;

		const text =
			typeof error === "string"
				? "\n" + warn + "\n" + error + "\n" + warn
				: "\n" +
					warn +
					"\n" +
					(error?.stack || error?.message || error) +
					"\n" +
					warn;

		if (type === "error") {
			this._error.execute(text);
		} else {
			this._warn.execute(text);
		}

		return text;
	};

	public static readonly Log = (
		message: unknown[],
		enabled?: boolean,
		trace?: boolean
	): void => {
		if ((enabled || Env.data.DEVELOP_MODE === "true") && !trace)
			this._log.execute(message);

		if (trace) {
			const text = message
				.map((msg) => JSON.stringify(msg, undefined, 4))
				.join("\n");
			const error = new Error(text);

			this._log.execute(error.stack || error.message);
			this._log.write(error.stack || error.message);
		}
	};

	public static readonly Trace = () => {
		console.trace();
	};

	public static readonly Error = <T = string>(error?: T) => {
		if (!error) return "no error there";

		if (!(error instanceof Error) && typeof error !== "string")
			return "your error is not error or string";

		return this.WarnComponent(JSON.stringify(error, undefined, 4), "error");
	};

	public static readonly Warn = <T = string>(msg?: T) => {
		if (!msg) return "no msg therr";

		if (!(msg instanceof Error) && typeof msg !== "string")
			return "your msg is not error or string";

		return this.WarnComponent(msg, "warn");
	};
}

export { Debug };
