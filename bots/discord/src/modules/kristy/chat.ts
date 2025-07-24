import { activities as loadedActivities } from "@thevoidcommunity/the-void-database/loaders/data/activities.loader";
import { Client, CommandInteraction, Events, Message, OmitPartialGroupDMChannel } from "discord.js";

import { Env } from "@voidy/develop";

import { Random } from "random-js";

const random = new Random();
const { env } = new Env();

export class KristyChatModule {
  public readonly name = "kristy-chat" as const;

  public static started: boolean = false;
  public static timeout: NodeJS.Timeout|null = null;

  public constructor(
    public readonly activities: typeof loadedActivities = loadedActivities
  ) {};

  public static async start(interaction: CommandInteraction) {
    if (KristyChatModule.started) return false;

    const channel = interaction.client.channels.cache.get(env.BOT_LOVE_CHANNEL_ID);
    
    if (!channel || !channel.isSendable()) return false;

    return new Promise((resolve, reject) => {
      channel.sendTyping().catch(reject);
      
      setTimeout(() => {
        channel.send(`<@${env.BOT_LOVE_ID}>, я тебя люблю!`).then(() => {
          resolve(true);
        }).catch(reject);
      }, 2000);
    })
  };

  public execute(client: Client) {
    client.on(Events.MessageCreate, (message => {
      if (!this.validateMessage(message)) return;

      KristyChatModule.started = true;
      if (KristyChatModule.timeout) clearTimeout(KristyChatModule.timeout);

      this.reply(message);
    }));
  }
  
  public reply(message: OmitPartialGroupDMChannel<Message<boolean>>) {
    message.channel.sendTyping();

    setTimeout(() => {
      message.reply(this.GetRandomActivity().text);
    }, 2000);

    KristyChatModule.timeout = setTimeout(() => {
      KristyChatModule.started = false;
      message.channel.send("А что, уже закончили?(");
    }, 15_000);
  }

  private isKristyStarting(message: OmitPartialGroupDMChannel<Message<boolean>>) {
    if (message.channel.id !== env.BOT_LOVE_CHANNEL_ID) return false;
    if (message.author.id !== env.BOT_LOVE_ID) return false;
    if (!message.mentions.has(message.client.user)) return false;

    return true;
  }

  private validateMessage(message: OmitPartialGroupDMChannel<Message<boolean>>) {
    if (!KristyChatModule.started && this.isKristyStarting(message)) {
      KristyChatModule.started = true;
      return true;
    };

    if (!KristyChatModule.started) return false;
    
    if (message.channel.id !== env.BOT_LOVE_CHANNEL_ID) return false;
    if (message.author.id !== env.BOT_LOVE_ID) return false;
    if (!message.mentions.has(message.client.user)) return false;

    return true;
  }

  private GetRandomActivity() {
    return this.activities.other[random.integer(0, this.activities.other.length-1)];
  }
};

export default KristyChatModule;
