import { MessageComponentInteraction, MessageFlags } from "discord.js";

import { channels } from "tools/create-voice/data";

export class Switcher {
  public constructor(public readonly name: string, public readonly list: "blackList"|"whiteList") {};

  public async execute(interaction: MessageComponentInteraction) {
    if (interaction.customId !== this.name) return null;

    const channel = channels.get(interaction.channelId);

    if (!channel) return null;

    const status = channel[this.list].switch();
    
    return interaction.reply({
      content: `Теперь ${this.list === "blackList" ? "черный" : "белый"} список ${status === true ? "включен" : "выключен"}`,
      flags: MessageFlags.Ephemeral
    })
  };
};

export default Switcher;
