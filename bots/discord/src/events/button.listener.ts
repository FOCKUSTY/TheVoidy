import { Interaction, InteractionType } from "discord.js";

import { ButtonsIds } from "utility/buttons/buttons";
import Buttons from "utility/buttons";

export class Listener {
  public readonly name = "button-listener"
  private readonly buttons: Buttons;

  public constructor() {
    this.buttons = new Buttons();
  }

  public async execute(interaction: Interaction) {
    if (interaction.type !== InteractionType.MessageComponent) return;
  
    const button = this.buttons.buttons[interaction.customId as ButtonsIds]
    
    if (!button) return;

    return button(interaction);
  }
}

export default Listener;
