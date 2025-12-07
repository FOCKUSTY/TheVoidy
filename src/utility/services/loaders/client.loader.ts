import { Logger } from "@develop";

import { Client as DiscordClient } from "discord.js";
import Formatter, { Colors } from "f-formatter";

import Filter from "../service/filter.service";

const guilds: string[] = [];
const users: string[] = [];
const names: string[] = [];
const getData = (type: DataType) => (type === "users" ? users : guilds);

const formatter = new Formatter();

type DataType = "users" | "guilds";
export type Objects = {
  idea: { idea: string; ideaDetail: string }[];
  download: string[];
  names: string[];
};

const ruWords: Record<DataType, [string, string]> = {
  users: ["пользователя", "пользователей"],
  guilds: ["гильдии", "гильдий"]
};
const formatRuWords = (number: number, type: DataType) => formatter.RuWords(number, ruWords[type]);

export class ClientLoader {
  private readonly _logger = new Logger("Loader");
  private readonly _filter: Filter;

  private readonly _objects: Objects;
  private readonly _guilds: string[] = [];
  private readonly _users: string[] = [];
  private readonly _names: string[] = [];

  public constructor(objects: Objects, banwords: string[]) {
    this._objects = objects;
    this._filter = new Filter(banwords);

    this._guilds = guilds;
    this._users = users;
    this._names = names;
  }

  private async load(client: DiscordClient, type: DataType) {
    const size =
      type === "users" ? client.users.cache.filter((u) => !u.bot).size : client.guilds.cache.size;

    this._logger.execute(`Загрузка ${size} ` + formatRuWords(size, type), {
      color: Colors.yellow
    });

    const data = getData(type);
    client[type].cache.forEach((user) => {
      const name = this._filter.filter(user, type);
      if (!name) {
        return;
      }

      data.push(name);
    });

    const eliminated = size - data.length;
    if (eliminated > 0) {
      this._logger.execute(`Отсеивание ${eliminated} ${formatRuWords(eliminated, type)}`, {
        color: Colors.yellow
      });
    }

    this._logger.execute(`Загрузка ${data.length} ${formatRuWords(data.length, type)} успешна`, {
      color: Colors.green
    });
  }

  private async loadUsers(client: DiscordClient) {
    this.load(client, "users");
  }

  private async loadGuilds(client: DiscordClient) {
    this.load(client, "guilds");
  }

  public readonly execute = async (client: DiscordClient) => {
    this.loadUsers(client);
    this.loadGuilds(client);

    names.push(...this._objects.names);
  };

  public get guilds() {
    return this._guilds;
  }

  public get users() {
    return this._users;
  }

  public get names() {
    return this._names;
  }

  public Get = (getter: "user" | "guild" | "name"): string[] => {
    if (getter === "user") return this._users;
    else if (getter === "guild") return this._guilds;
    else return this._names;
  };
}

export default ClientLoader;
