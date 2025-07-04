import { Env, Logger } from "@voidy/develop";

import { join } from "path";
import { readdirSync } from "fs";

import Button from "./abstract.class";
import { BUTTONS } from "./buttons";

const EXTENTION: "ts" | "js" = Env.env.NODE_ENV === "prod" ? "js" : "ts";
const FORMAT = new RegExp("[\\w\\W]+\\.button\\." + EXTENTION);

type ButtonType = {
  button: typeof Button,
  name: (typeof Button)["name"],
  builder: (typeof Button)["builder"],
  execute: Button["execute"]
}

type IButtons = {
  [key: string]: ButtonType
} | Record<(typeof BUTTONS)[number], ButtonType
>;

export const global: IButtons = {} as IButtons;

export class Buttons {
  private readonly logger = new Logger("Deployer");
  public readonly buttons: IButtons;

  public constructor() {
    if (Object.keys(global).length > 0) {
      this.buttons = global;
    } else {
      this.buttons = <IButtons>this.deploy();
    }
  };

  private deploy() {
    const data: {[key: string]: ButtonType} = {};

    readdirSync(__dirname).forEach(folder => {
      try {
        readdirSync(join(__dirname, folder)).forEach(file => {
          if (!FORMAT.test(file)) return;

          const button: typeof Button = require(join(__dirname, folder, file)).default;
          const name = folder + "-" + button.name;

          this.logger.execute("Загрузка кнопки: " + name);

          data[name] = {
            button,
            name: button.name,
            builder: button.builder,
            execute: new button().execute
          };

          (global as {[key: string]: ButtonType})[name] = data[name] as ButtonType;
        })
      } catch { /* empty */ }
    });

    return data;
  };
};

export default Buttons;
