import { Debug } from "v@develop";
import { Interaction, InteractionType } from "discord.js";
import CustomIds from "v@services/modal/custom-ids.modal";
import { Services } from "v@types/all/services.type";

class Listener {
  private readonly ids: CustomIds;

  public readonly name = "modal-listener";

  public constructor(services: Services) {
    this.ids = new CustomIds(services);
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
