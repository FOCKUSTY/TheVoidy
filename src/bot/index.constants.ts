import { loaders } from "@thevoidcommunity/the-void-database";
import { version } from "../../package.json";

const { Constants } = loaders;

const THEVOIDs_CONSTANTS: { [key: string]: string } = {
  "THEVOIDSBOT_REVERSE_GENDER": "девушка",
  "THEVOIDSBOT_NREVERSE": "The Void",
  "THEVOIDSBOT_REVERSE": "The Abyssia",
  "THEVOIDSBOT_LOVE": "Kristy",
  "THEVOIDSBOT_REVERSE_LOVE": "The Void",
  "THEVOID_LOVE": "Kristy",
  "THEVOID": "Меня",
  "typend_A": "",
  "typend_B": "ым",
  "version": version
};

new Constants(THEVOIDs_CONSTANTS).execute();

export { THEVOIDs_CONSTANTS };
