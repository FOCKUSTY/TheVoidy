import { Debug, Logger } from "@develop";

import type { Client as DiscordClient } from "discord.js";

import Discord from "./utility/service/discord.service";
import { FilesLoader } from "@utility/services/loaders/files.loader";

import { join } from "node:path";
import { Services } from "@types";

const dir = join(__dirname, "events");
const filesLoader = new FilesLoader(dir);

export class EventsLoader {
  private readonly logger = new Logger("Events");
  private readonly _client: DiscordClient = new Discord().client;

  public constructor(private readonly _services: Services) {};

  public execute() {
    return filesLoader.execute((path) => {
      this.logger.execute(`Загрузка прослушивателя ${path}`);

      const EventClass = require(path).default;
      const event = new EventClass(this._services);

      if (event.once) {
        this._client.once(event.tag, (...args) => event.execute(...args));
      } else if (event.execute) {
        if (event.tag === "unique") {
          Debug.Log(["Пропускаю", event.name, "из-за уникального запуска"]);
          return;
        }

        Debug.Log(["Инициализация", event.tag + "..."]);
        this._client.on(event.tag, (...args) => event.execute(...args));
      }
    })
  }
};

export default EventsLoader;
