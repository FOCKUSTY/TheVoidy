import { Debug } from "@voidy/develop";
import { Interaction, InteractionType } from "discord.js";
import { Services } from "@voidy/services";
import { Types } from "@voidy/types";

class Listener {
  private readonly ids: Services.Modals.CustomIDs;

  public readonly name = "modal-listener";

  public constructor(services: Types.Services) {
    this.ids = new Services.Modals.CustomIDs(services);
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
