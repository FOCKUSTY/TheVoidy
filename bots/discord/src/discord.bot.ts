import { Env, Debug } from "v@develop";

import ICL from "./events/interaction-create.listener";
import ML from "./events/modal.listener";

import Deployer from "./deploy.commands";
import DeployEvents from "./deploy.events";

import { Services } from "v@types/all/services.type";

import path from "path";
import fs from "fs";

import {
	Client as DiscordClient,
	Collection,
	Events,
	GatewayIntentBits,
	Partials
} from "discord.js";

import "./slash.commands";

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

const Commands = new Collection();
const Cooldowns = new Collection();

const fileType: ".ts" | ".js" = Env.get<false>("NODE_ENV") === "prod" ? ".js" : ".ts";

const Login = async (clientToken: string, services: Services) => {
	const foldersPath = path.join(__dirname, "commands");
	const commandsFolder = fs.readdirSync(foldersPath);

	const eventsPath = path.join(__dirname, "events");
	const eventFiles = fs
		.readdirSync(eventsPath)
		.filter((file) => file.endsWith(fileType) && !file.endsWith(".d.ts"));

	const modalListener = new ML(services);
	const interactionListener = new ICL();

	Client.on(Events.InteractionCreate, async (interaction) => {
		interactionListener.execute(interaction, Commands, Cooldowns);
		modalListener.execute(interaction);
	});

	new Deployer(foldersPath, commandsFolder).write(Commands);
	new DeployEvents(eventsPath, eventFiles, services).execute();

	await Client.login(clientToken).catch((e) => Debug.Error(e));
};

export { Commands, Login as LoginDiscord };

export default Client;
