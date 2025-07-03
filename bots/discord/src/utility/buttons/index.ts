import { Env, Logger } from "@voidy/develop";

import { join } from "path";
import { readdirSync } from "fs";

import Button from "./abstract.class";
import { MessageComponentInteraction } from "discord.js";
import { BUTTONS } from "./buttons";

const EXTENTION: "ts" | "js" = Env.env.NODE_ENV === "prod" ? "js" : "ts";
const FORMAT = new RegExp("[\\w\\W]+\\.button\\." + EXTENTION);

type Execute<T = unknown> = (interaction: MessageComponentInteraction) => Promise<T>;

type IButtons = {
  [key: string]: Execute<unknown>
} | Record<(typeof BUTTONS)[number], Execute<unknown>
>;

export class Buttons {
  private readonly logger = new Logger("Deployer");
  public readonly buttons: IButtons;

  public constructor() {
    this.buttons = <IButtons>this.deploy();
  };

  private deploy() {
    const data: {[key: string]: Execute<unknown>} = {};

    readdirSync(__dirname).forEach(folder => {
      try {
        readdirSync(join(__dirname, folder)).map(file => {
          const button: typeof Button<unknown> = require(join(__dirname, folder, file)).default;
          if (!FORMAT.test(file)) return [];
  
          this.logger.execute("Загрузка кнопки: " + folder + "-" + button.name);
          
          data[folder + "-" + button.name] = new button().execute;
        })
      } catch { /* empty */ }
    });

    return data;
  };
};

export default Buttons;
