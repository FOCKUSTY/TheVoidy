import { Interaction, InteractionType } from "discord.js";

import { Debug } from "@voidy/develop";
import { Types } from "@voidy/types";

import Ids from "utility/modals/custom-ids.modal";

class Listener {
  private readonly ids: Ids;

  public readonly name = "modal-listener";

  public constructor(services: Types.Services) {
    this.ids = new Ids(services);
  }

  public async execute(interaction: Interaction) {
    if (interaction.type !== InteractionType.ModalSubmit) return;
    const { ids } = this.ids;

    for (const id in ids) {
      if (interaction.customId != ids[id].id) continue;

      try {
        Debug.Log(["Запуск модальника: " + ids[id], "под id: " + ids[id].id]);

        await ids[id].execute(interaction);
      } catch (error) {
        Debug.Error(error);

        await interaction.reply({
          content: "Произошла какая-то ошибка",
          ephemeral: true
        });
      }
    }
  }
}

export default Listener;
