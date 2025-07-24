import { Env, Debug } from "@voidy/develop";

import ICL from "./events/interaction-create.listener";
import ML from "./events/modal.listener";

import CommandsModule from "./commands/commands.module";
import DeployEvents from "./deploy.events";

import { Types } from "@voidy/types";

import path from "path";
import fs from "fs";

import {
  Client as DiscordClient,
  Collection,
  Events,
  GatewayIntentBits,
  Partials
} from "discord.js";
import Command from "./types/command.type";

const Client = new DiscordClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences
  ],
  partials: [Partials.Channel]
});

export const Commands = new Collection<string, Command>();
export const Cooldowns = new Collection();

type ModulesResolverReturn = ReturnType<typeof ModulesResolver>;
export type ModulesType = {
  [P in keyof ModulesResolverReturn]: ReturnType<ModulesResolverReturn[P]["execute"]>;
};
export const Modules: ModulesType = {} as ModulesType;

const fileType: ".ts" | ".js" = Env.env.NODE_ENV === "prod" ? ".js" : ".ts";

const ModulesResolver = () => {
  return {
    commands: new CommandsModule(true, Commands)
  } as const;
};

const Login = async (clientToken: string, services: Types.Services) => {
  const modules = Object.fromEntries(
    Object.values(ModulesResolver()).map((data) => [data.name, data.execute()])
  );
  Object.keys(modules).forEach(
    (key) => ((Modules as { [key: string]: unknown })[key] = modules[key])
  );

  const eventsPath = path.join(__dirname, "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(fileType) && !file.endsWith(".d.ts"));

  const modalListener = new ML(services);
  const interactionListener = new ICL();

  Client.on(Events.InteractionCreate, async (interaction) => {
    interactionListener.execute(interaction, Modules, Cooldowns);
    modalListener.execute(interaction);
  });

  new DeployEvents(eventsPath, eventFiles, services).execute();

  await Client.login(clientToken).catch((e) => Debug.Error(e));
};

export { Login as LoginDiscord };

export default Client;
