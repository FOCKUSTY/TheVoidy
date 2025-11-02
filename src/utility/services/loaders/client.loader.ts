import { Logger } from "@develop";

import { Client as DiscordClient } from "discord.js";

import Filter from "../service/filter.service";

import Formatter, { Colors } from "f-formatter";

const guilds: string[] = [];
const users: string[] = [];
const names: string[] = [];

const formatter = new Formatter();

export type Objects = {
  idea: { idea: string; ideaDetail: string }[];
  download: string[];
  names: string[];
};

export class ClientLoader {
  private readonly logger = new Logger("Loader");
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

  private readonly UsersLoader = async (Client: DiscordClient) => {
    const size = Client.users.cache.filter((u) => !u.bot).size;

    this.logger.execute(`Загрузка ${size} ` + formatter.RuWords(size, ["пользователя", "пользователей"]), {
      color: Colors.yellow
    });

    Client.users.cache.forEach((user) => {
      const name = this._filter.userFilter(user);

      if (name) users.push(name);
    });

    if (size - users.length > 0)
      this.logger.execute(
        `Отсеивание ${size - users.length} ${formatter.RuWords(size - users.length, ["пользователя", "пользователей"])}`,
        { color: Colors.yellow }
      );

    this.logger.execute(
      `Загрузка ${users.length} ${formatter.RuWords(users.length, ["пользователя", "пользователей"])} успешна`,
      { color: Colors.green }
    );
  };

  private readonly GuildsLoader = async (Client: DiscordClient) => {
    const size = Client.guilds.cache.size;

    this.logger.execute(`Загрузка ${size} ` + formatter.RuWords(size, ["гильдии", "гильдий"]), {
      color: Colors.yellow
    });

    Client.guilds.cache.forEach((guild) => {
      const name = this._filter.guildFilter(guild);

      if (name) guilds.push(name);
    });

    if (size - guilds.length > 0)
      this.logger.execute(
        `Отсеивание ${size - guilds.length} ${formatter.RuWords(size - guilds.length, ["гильдии", "гильдий"])}`,
        { color: Colors.yellow }
      );

    this.logger.execute(
      `Загрузка ${guilds.length} ${formatter.RuWords(guilds.length, ["гильдии", "гильдий"])} успешна`,
      { color: Colors.green }
    );
  };

  public readonly execute = async (Client: DiscordClient) => {
    this.UsersLoader(Client);
    this.GuildsLoader(Client);

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
