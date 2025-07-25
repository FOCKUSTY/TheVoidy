import { Debug, Logger } from "@voidy/develop";

import { ActivityType, type Client as DiscordClient } from "discord.js";
import { Random } from "random-js";
import Formatter from "f-formatter";

import { Types } from "@voidy/types";

import {
  activities as loadedActivities,
  utility
} from "@thevoidcommunity/the-void-database/loaders/data/activities.loader";
import ObjectLoader from "@thevoidcommunity/the-void-database/loaders/data/objects.loader";
import { Activity } from "@thevoidcommunity/the-void-database/types/activity.types";

import { Services } from "@voidy/services";

const random = new Random();
const historyObject = new Map();
const titleRegExp = new RegExp("[${]+[a-zA-Z]+[}]+", "gi");
const formatterRegExp = new RegExp("[a-zA-Z]+", "gi");
const formatter = new Formatter();
const objects = new ObjectLoader().execute();

class RandomActiviy {
  private readonly Logger = new Logger("Activity").execute;

  private readonly _client: DiscordClient;
  private readonly _clientLoader = new Services.Loaders.ClientLoader(objects, utility.banwords);

  private readonly _preffix: string = "";
  private readonly _setActivity: boolean = true;

  constructor(client: DiscordClient, preffix: string = "", setActivity: boolean = true) {
    this._client = client;

    this._preffix = preffix === "" ? "" : " | " + preffix;

    this._setActivity = setActivity;
  }

  private readonly RegExpFormatter = (activiy: Activity) => {
    if (activiy && titleRegExp.test(activiy.text)) {
      const v: string = (activiy.text.match(titleRegExp) || [""])[0];
      const variable = v.match(formatterRegExp);

      if (!variable) return activiy;

      const array = utility.titles[variable[0]];
      Debug.Log([{ array: array || null, variable, titles: utility.titles }]);
      const title = array[random.integer(0, array.length - 1)];

      activiy.text = activiy.text.replace(v, title);
    }

    return activiy;
  };

  private readonly Typified = async (type: "user" | "guild" | "name"): Promise<Activity> => {
    try {
      if (!this._client.user) return { text: "cmd: Error", type: "custom" };

      const history = historyObject.get(type) ?? [];
      historyObject.set(type, history);

      const activities = Services.ArrayService.Shuffle(
        loadedActivities[type === "guild" ? "guild" : "name"]
      );

      const randomActivityIndex = random.integer(0, activities.length - 1);
      const randomActivity = activities[randomActivityIndex];

      const array = this._clientLoader.Get(type);

      const firstRandomElementIndex = random.integer(0, array.length - 1);
      const secondRandomElementIndex = random.integer(0, array.length - 1);

      const firstRandomElement = array[firstRandomElementIndex];
      const secondRandomElement = array[secondRandomElementIndex];

      const text: string =
        randomActivity.text
          .replace("{random}", firstRandomElement)
          .replace("{randomTwo}", secondRandomElement) + this._preffix;

      if (this._setActivity) {
        Debug.Log([
          `Случайные элементы: ${firstRandomElement} & ${secondRandomElement} из ${array.length}`
        ]);
      }

      return { text: text, type: randomActivity.type };
    } catch (err) {
      Debug.Error(err);

      return { text: "cmd: Error!", type: "custom" };
    }
  };

  private readonly Standart = async (): Promise<Activity> => {
    try {
      if (!this._client.user) return { text: "cmd: Error", type: "custom" };

      const history = historyObject.get("activities") ?? [];
      historyObject.set("activities", history);

      const activities = Services.ArrayService.Shuffle(loadedActivities["other"]);

      const randomActivityIndex = random.integer(0, activities.length - 1);
      const randomActivity: Activity = this.RegExpFormatter(activities[randomActivityIndex]);

      return {
        text: randomActivity.text + this._preffix,
        type: randomActivity.type
      };
    } catch (err) {
      Debug.Error(err);
      return { text: "cmd: Error", type: "custom" };
    }
  };

  public readonly execute = async (): Promise<Activity> => {
    if (!this._client.user) return { text: "cmd: Error", type: "custom" };

    const history = historyObject.get("activities") ?? [];
    historyObject.set("number-activity", history);

    const randomChance = random.integer(0, 100);

    const Log = (activity: Activity) => {
      if (this._setActivity) {
        this.Logger(`Устанавливаю активность: "${activity.text}", тип: ${activity.type}`);
      }

      return { text: activity.text, type: activity.type };
    };

    if (this._setActivity) Debug.Log(["Chance:", randomChance]);

    if (randomChance <= 10) {
      const length = this._clientLoader.guilds.length;
      const word = formatter.RuWords(length, ["сервере", "серверах", "серверах"]);

      const text = `Я уже на ${length} ${word}`;

      if (this._setActivity)
        this._client.user.setActivity({ name: text, type: ActivityType.Custom });

      return Log({ text, type: "custom" });
    }

    if (randomChance >= 10 && randomChance <= 40) {
      let type: "user" | "guild" | "name";

      if (randomChance >= 10 && randomChance <= 20) type = "user";
      else if (randomChance >= 20 && randomChance <= 30) type = "guild";
      else type = "name";

      const activity = await this.Typified(type);

      if (this._setActivity)
        this._client.user.setActivity({
          name: activity.text,
          type: Number(Types.Discord.ActivityTypes[activity.type])
        });

      return Log(activity);
    }

    if (randomChance >= 40) {
      const activity = await this.Standart();

      if (this._setActivity) {
        this._client.user.setActivity({
          name: activity.text,
          type: Number(Types.Discord.ActivityTypes[activity.type])
        });
      }

      return Log(activity);
    }

    return { text: "cmd: Error", type: "custom" };
  };
}

export default RandomActiviy;
