import { Events, Interaction, InteractionType, MessageFlags } from "discord.js";

import { Debug } from "@develop";

import Ids from "@discord/utility/modals/custom-ids.modal";
import { Services } from "@types";

const lowerize = (text: string) => {
  return text[0].toLocaleLowerCase() + text.slice(1);
}

const capitalize = (text: string) => {
  return text[0].toUpperCase() + text.slice(1);
}

const fromKebabCaseToCamelCase = (text: string) => {
  return lowerize(text.split("-").map(text => capitalize(text)).join(""));
}

class Listener {
  private readonly ids: Ids;

  public readonly name = "modal-listener";
  public readonly tag = "unique";

  public constructor(services: Services) {
    this.ids = new Ids(services);
  }

  public async execute(interaction: Interaction) {
    if (interaction.type !== InteractionType.ModalSubmit) return;
    const { ids } = this.ids;
    const id = fromKebabCaseToCamelCase(interaction.customId);

    Debug.Log(["Поиск модального окна под id " + id + ` (${interaction.customId})`]);
    const modal = ids[id];

    if (!modal) {
      Debug.Warn(["Модальное окно " + interaction.customId + " не было найдено"]);
      return interaction.reply({
        content: "Произошла какая-то ошибка",
        flags: MessageFlags.Ephemeral
      })
    };

    Debug.Log(["Запуск модального окна", modal.id]);
    return modal.execute(interaction).then(() => Debug.Log(["Видимо, модальное окно", interaction.customId, "отработало без проблем"]));;
  }
}

export default Listener;
