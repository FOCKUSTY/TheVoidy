import type { Client as DiscordClient } from "discord.js";
import { Events } from "discord.js";

import { Debug, Logger } from "@develop";

import { utility } from "@thevoidcommunity/the-void-database/loaders/data/activities.loader";

import RandomActiviy from "../utility/service/random-activity.service";

import { loaders } from "@thevoidcommunity/the-void-database";
import { ActivityTypes } from "@types";
import { ClientLoader } from "@services";
const { ActivitiesLoader, ObjectsLoader } = loaders;

class Listener {
  public readonly name = Events.ClientReady;
  public readonly tag = Events.ClientReady;
  public readonly once = true;

  async execute(Client: DiscordClient) {
    Debug.Log("Инициализация Discord бота...");
    if (!Client.user) return;

    Debug.Log("Загрузка активностей...");
    const randomActivity = new RandomActiviy(Client, process.env.NODE_ENV === "dev" ? "dev" : "");

    const activiesLoader = new ActivitiesLoader();
    activiesLoader.execute();

    Debug.Log("Активности загружены (подробнее в логах активностей)");

    Debug.Log("Установка статуса...");
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
    Debug.Log("Статус установлен");

    Debug.Log("Инициализация объектов и исключений...");
    const objects = new ObjectsLoader().execute();

    const clientLoader = new ClientLoader(objects, utility.banwords);
    clientLoader.execute(Client);

    Debug.Log("Объекты и исключения инициализированны (подробнее в логах загрузчика)");

    Debug.Log("Установка интервала...");
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
    Debug.Log("Интервал инициализрован");

    new Logger("TheVoid").execute("Начинаю работу");
    Debug.Log("Бот инициализирован");
  }
}

export default Listener;
