import {
  SlashCommandBuilder,
  ModalActionRowComponentBuilder,
  CommandInteraction,
  TextInputBuilder,
  TextInputStyle,
  ModalBuilder,
  ActionRowBuilder
} from "discord.js";

import ObjectsLoader from "@thevoidcommunity/the-void-database/loaders/data/objects.loader";
import Ids from "@discord/utility/modals/custom-ids.modal";

import { Random } from "random-js";
import Command from "@discord/types/command.type";

const customIds = Ids.getIds();
const objects = new ObjectsLoader().execute();

export default new Command({
  data: new SlashCommandBuilder()
    .setName("idea")
    .setDescription("Отправить свою идею!")
    .setNameLocalizations({ ru: "идея", "en-US": "idea" })
    .setDescriptionLocalizations({
      ru: "Отправить свою идею",
      "en-US": "Send a your idea"
    }),

  async execute(interaction: CommandInteraction) {
    const components = customIds.ideaModal.components;
    const idea: { idea: string; ideaDetail: string }[] = objects.idea;

    const modal = new ModalBuilder()
      .setCustomId(customIds.ideaModal.id)
      .setTitle("Ваше сообщение !");
    const randomNumber = new Random().integer(0, idea.length - 1);
    const placeholderTitle = idea[randomNumber].idea;
    const placeholderDescriptioin = idea[randomNumber].ideaDetail;

    modal.addComponents(
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId(components.title)
          .setLabel("Заголовок Вашей идеи")
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(256)
          .setPlaceholder(placeholderTitle)
      ),
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId(components.description)
          .setLabel("Ваша идея (Описание)")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(4000)
          .setPlaceholder(placeholderDescriptioin)
      )
    );

    await interaction.showModal(modal);
  }
});
