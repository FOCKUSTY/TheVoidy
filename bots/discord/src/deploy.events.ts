import { Logger } from "@voidy/develop";

import type { Client as DiscordClient } from "discord.js";
import Discord from "./utility/service/discord.service";

import { Types } from "@voidy/types";

import path from "node:path";

class EventsLoader {
  private readonly Logger = new Logger("Events").execute;
  private readonly _client: DiscordClient = new Discord().client;

  private readonly _path: string;
  private readonly _files: string[];
  private readonly _services: Types.Services;

  public constructor(eventsPath: string, eventFiles: string[], services: Types.Services) {
    this._path = eventsPath;
    this._files = eventFiles;
    this._services = services;
  }

  public readonly execute = () => {
    for (const file of this._files) {
      const filePath = path.join(this._path, file);

      const event = new (require(filePath).default)(this._services);

      this.Logger(`Загрузка прослушивателя ${event.name}`);

      if (event.once) {
        this._client.once(event.tag, (...args) => event.execute(...args));
      } else if (event.execute) {
        if (event.tag === "unique") continue;

        this._client.on(event.tag, (...args) => event.execute(...args));
      }
    }
  };
}

export default EventsLoader;
