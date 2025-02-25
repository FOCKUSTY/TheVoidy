import type { Guild, User } from "discord.js";

class Filter {
  private _banwords: string[] = [];
  private _last_value: string | null = null;

  public constructor(banwords: string[]) {
    this._banwords = banwords;
  }

  private readonly BadwordsHandler = (value: string): string | null => {
    for (const banword of this._banwords) {
      const word = new RegExp(banword.replace(/\*/gi, "\\W"));

      if (value.match(word)) return null;
      else continue;
    }

    return value;
  };

  public readonly execute = (value: string, type: "user" | "guild" = "user"): string | null => {
    if (this._banwords.length === 0) this._banwords = [];

    if (this._banwords.includes(value)) {
      this._last_value = null;
    } else if (value.match(/[\W]/gi) && !value.match(/[а-я0-9]/gi) && type === "user") {
      this._last_value = null;
    } else {
      this._last_value = this.BadwordsHandler(value);
    }

    return this._last_value;
  };

  public readonly guildFilter = (guild: Guild): string | null => {
    const verifiedGuild = this.execute(guild.name, "guild");

    this._last_value = verifiedGuild;

    return this._last_value || verifiedGuild;
  };

  public readonly userFilter = (user: User): string | null => {
    if (user.bot) {
      this._last_value = null;
    } else {
      const verifiedUser = this.execute(user.globalName || user.username);

      this._last_value = verifiedUser;
    }

    return this._last_value;
  };

  get lastValue() {
    return this._last_value;
  }
}

export default Filter;
