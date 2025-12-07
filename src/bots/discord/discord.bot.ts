import { Debug, Logger } from "@develop";

import ICL from "./events/interaction-create.listener";
import ML from "./events/modal.listener";

import KristyChatModule from "./modules/kristy/chat";

import CommandsModule from "./commands/commands.module";
import DeployEvents from "./deploy.events";

import {
  Client as DiscordClient,
  Collection,
  Events,
  GatewayIntentBits,
  Partials
} from "discord.js";
import Command from "./types/command.type";
import { Services } from "@types";

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

type ModulesResolverReturn = Awaited<ReturnType<typeof ModulesResolver>>;
export type ModulesType = {
  [P in keyof ModulesResolverReturn]: Awaited<ReturnType<ModulesResolverReturn[P]["execute"]>>;
};
export const Modules: ModulesType = {} as ModulesType;

const ModulesResolver = async () => {
  return {
    commands: new CommandsModule(true, Commands),
    kristy: new KristyChatModule()
  } as const;
};

const loader = new Logger("Loader");

const Login = async (clientToken: string, services: Services) => {
  const modules = await ModulesResolver();
  for (const key in modules) {
    const module = modules[key as keyof ModulesType];
    loader.execute("Загрузка модуля: " + key);
    await module.execute(Client);
  }

  Object.keys(modules).forEach(
    (key) => ((Modules as { [key: string]: unknown })[key] = modules[key as keyof ModulesType])
  );

  const modalListener = new ML(services);
  const interactionListener = new ICL();

  Client.on(Events.InteractionCreate, async (interaction) => {
    interactionListener.execute(interaction, Modules, Cooldowns);
    modalListener.execute(interaction);
  });

  new DeployEvents(services).execute();

  await Client.login(clientToken).catch((e) => Debug.Error(e));
};

export { Login as LoginDiscord };

export default Client;
