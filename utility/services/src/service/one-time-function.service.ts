const functions = new Map();

class OneTimeFunction<T, K> {
	public readonly _function: (data: K[]) => T;
	public readonly _name: string;
	public readonly _function_arguments: K[];

	public constructor(name: string, func: () => T, funcParameters: K[] = []) {
		functions.set(name, false);

		this._name = name;
		this._function = func;
		this._function_arguments = funcParameters;
	}

	public execute(): T | false {
		if (functions.get(this._name)) {
			return false;
		} else {
			functions.set(this._name, true);

			return this._function(this._function_arguments);
		}
	}
}

export default OneTimeFunction;
