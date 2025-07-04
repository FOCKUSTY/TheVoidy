import { MessageComponentInteraction, MessageFlags } from "discord.js";

import { channels } from "src/utility/tools/voice/data";

export class Switcher {
  public static readonly prefix = "voice-";

  public constructor(public readonly name: string) {};

  public execute(list: "blackList"|"whiteList") {
    return async(interaction: MessageComponentInteraction) => {
      if (interaction.customId !== Switcher.prefix+this.name) return null;
  
      const channel = channels.get(interaction.channelId);
  
      if (!channel) return null;
  
      const status = channel[list].switch();
      
      return interaction.reply({
        content: `Теперь ${list === "blackList" ? "черный" : "белый"} список ${status === true ? "включен" : "выключен"}`,
        flags: MessageFlags.Ephemeral
      })
    } 
  };
};

export default Switcher;
