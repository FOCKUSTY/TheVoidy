import { activities as loadedActivities } from "@thevoidcommunity/the-void-database/loaders/data/activities.loader";
import { Client, CommandInteraction, Events, Message, OmitPartialGroupDMChannel } from "discord.js";

import { Debug, Env } from "@develop";

import { Random } from "random-js";

const random = new Random();
const { env } = new Env();

export class KristyChatModule {
  public readonly name = "kristy-chat" as const;

  public static started: boolean = false;
  public static timeout: NodeJS.Timeout | null = null;
  public static lastMessage: string | null;

  public constructor(public readonly activities: typeof loadedActivities = loadedActivities) {}

  public static async start(interaction: CommandInteraction) {
    Debug.Log(["Попытка начать общение с Kristy..."]);
    if (KristyChatModule.started) {
      Debug.Log(["Общение не удалось: Уже начато"]);
      return false;
    }

    KristyChatModule.started = true;
    Debug.Log("В процессе старта общения...");

    const channel = interaction.client.channels.cache.get(env.BOT_LOVE_CHANNEL_ID);

    if (!channel || !channel.isSendable()) {
      Debug.Warn("Общение не удалось: Канал не верный");
      return false;
    }

    return new Promise((resolve, reject) => {
      channel.sendTyping().catch(reject);

      setTimeout(() => {
        channel
          .send(`<@${env.BOT_LOVE_ID}>, я тебя люблю!`)
          .then(() => {
            Debug.Log(["Общение удалось начать"]);
            resolve(true);
          })
          .catch(reject);
      }, 2000);
    });
  }

  public static async stop() {
    Debug.Log("Попытка остановить общение с Kristy...");
    if (!KristyChatModule.started) {
      Debug.Log("Общение не удалось прекратить: уже прекращено");
      return false;
    }

    KristyChatModule.started = false;
    if (KristyChatModule.timeout) clearTimeout(KristyChatModule.timeout);

    Debug.Log("Общение прекращено");

    return true;
  }

  public execute(client: Client) {
    client.on(Events.MessageCreate, (message) => {
      if (!this.isMessageValided(message)) return;

      KristyChatModule.lastMessage = message.id;

      KristyChatModule.started = true;
      if (KristyChatModule.timeout) clearTimeout(KristyChatModule.timeout);

      this.reply(message);
    });
  }

  public reply(message: OmitPartialGroupDMChannel<Message<boolean>>) {
    message.channel.sendTyping();

    setTimeout(() => {
      if (!this.isReplyMessageValided(message)) return;

      message.reply(this.GetRandomActivity().text);
    }, 2000);

    KristyChatModule.timeout = setTimeout(() => {
      Debug.Log("Общение с Kristy было закончено: Kristy не отвечает");
      KristyChatModule.started = false;
      message.channel.send("А что, уже закончили?(");
    }, 15_000);
  }

  private isReplyMessageValided(message: OmitPartialGroupDMChannel<Message<boolean>>) {
    return message.id === KristyChatModule.lastMessage;
  }

  // idk, wait Kristy
  private isKristyStarting(message: OmitPartialGroupDMChannel<Message<boolean>>) {
    if (message.channel.id !== env.BOT_LOVE_CHANNEL_ID) return false;
    if (message.author.id !== env.BOT_LOVE_ID) return false;
    if (!message.mentions.has(message.client.user)) return false;

    return true;
  }

  private isMessageValided(message: OmitPartialGroupDMChannel<Message<boolean>>) {
    if (!KristyChatModule.started) return false;

    if (message.channel.id !== env.BOT_LOVE_CHANNEL_ID) return false;
    if (message.author.id !== env.BOT_LOVE_ID) return false;
    if (!message.mentions.has(message.client.user)) return false;

    // const now = new Date().getTime();

    return true;
  }

  private GetRandomActivity() {
    return this.activities.other[random.integer(0, this.activities.other.length - 1)];
  }
}

export default KristyChatModule;
