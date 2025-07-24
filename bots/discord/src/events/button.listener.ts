import { Events, Interaction, InteractionType } from "discord.js";

import { ButtonsIds } from "utility/buttons/buttons";
import Buttons from "utility/buttons";
import { Debug } from "@voidy/develop";

export class Listener {
  public readonly name = "button-listener";
  public readonly tag = Events.InteractionCreate;
  private readonly buttons: Buttons;

  public constructor() {
    this.buttons = new Buttons();
  }

  public async execute(interaction: Interaction) {
    if (interaction.type !== InteractionType.MessageComponent) return;

    Debug.Log(["Поиск кнопки по id", interaction.customId]);
    const button = this.buttons.buttons[interaction.customId as ButtonsIds];

    if (!button) {
      Debug.Warn(["Кнопка", interaction.customId, "не была найдена"])
      return;
    };

    return button.execute(interaction);
  }
}

export default Listener;
