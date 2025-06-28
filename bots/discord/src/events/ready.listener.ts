import type { Client as DiscordClient } from "discord.js";
import { Events } from "discord.js";

import { Types } from "@voidy/types";
import { Logger } from "@voidy/develop";

import { utility } from "@thevoidcommunity/the-void-database/loaders/data/activities.loader";
import ClientLoader from "@voidy/services/dist/loaders/client.loader";

import RandomActiviy from "../utility/service/random-activity.service";

import { loaders } from "@thevoidcommunity/the-void-database";
const { ActivitiesLoader, ObjectsLoader } = loaders;

class Listener {
  public readonly name = Events.ClientReady;
  public readonly once = true;

  async execute(Client: DiscordClient) {
    if (!Client.user) return;

    const randomActivity = new RandomActiviy(Client, process.env.NODE_ENV === "dev" ? "dev" : "");
    const activiesLoader = new ActivitiesLoader();

    Client.user.setPresence({
      activities: [
        {
          name:
            process.env.NODE_ENV === "dev"
              ? "Запущено в режиме разработки!"
              : "Запущено в режиме итогов!",
          type: Number(Types.Discord.ActivityTypes.custom)
        }
      ],
      status: "idle"
    });

    activiesLoader.execute();

    const objects = new ObjectsLoader().execute();
    const clientLoader = new ClientLoader(objects, utility.banwords);

    clientLoader.execute(Client);

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
      1000 * 60 * 10 * 6
    );

    new Logger("TheVoid").execute("Начинаю работу");
  }
}

export default Listener;
