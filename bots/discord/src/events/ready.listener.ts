import type { Client as DiscordClient } from "discord.js";
import { Events } from "discord.js";

import { ActivityTypes } from "v@types/activities/activities.enum";
import { Logger } from "v@develop";

import ClientLoader from "v@services/loaders/client.loader";
import { loaders } from "@thevoidcommunity/the-void-database";

import RandomActiviy from "../utility/service/random-activity.service";

const { ActivitiesLoader } = loaders;

import { utility } from "@thevoidcommunity/the-void-database/loaders/data/activities.loader";
import ObjectLoader from "@thevoidcommunity/the-void-database/loaders/data/objects.loader";

const objects = new ObjectLoader().execute();

class Listener {
	public readonly name = Events.ClientReady;
	public readonly once = true;

	async execute(Client: DiscordClient) {
		if (!Client.user) return;

		const randomActivity = new RandomActiviy(
			Client,
			process.env.NODE_ENV === "dev" ? "dev" : ""
		);
		const activiesLoader = new ActivitiesLoader();

		Client.user.setPresence({
			activities: [
				{
					name:
						process.env.NODE_ENV === "dev"
							? "Запущено в режиме разработки!"
							: "Запущено в режиме итогов!",
					type: Number(ActivityTypes.custom)
				}
			],
			status: "idle"
		});

		activiesLoader.execute();
		new ClientLoader(objects, utility.banwords).execute(Client);

		setInterval(
			() => {
				randomActivity.execute();
			},
			1000 * 60 * 1
		);

		setInterval(
			() => {
				activiesLoader.reload();
			},
			1000 * 60 * 10
		);

		new Logger("TheVoid").execute("Начинаю работу");
	}
}

export default Listener;
