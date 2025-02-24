/* eslint-disable */

import { Interaction } from "../telegram/interaction.type";

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

	private readonly _name: string = "ERROR_NO_NAME";
	private readonly _options: string[] = [];
	public readonly executeFunc: (...data: T[]) => K;
	public readonly execute: (interaction: Interaction) => Promise<any> = async (
		interaction: Interaction
	) => {
		return await interaction.reply(this._error);
	};

	public constructor(data: Props<T, K>) {
		this._name = data.name;
		this._options = data.options || [];
		this.execute = data.execute;
		this.executeFunc = data.executeFunc;
	}

	public get name(): string {
		return this._name;
	}

	public get options(): string[] {
		return this._options;
	}
}

export default Command;
