import {
  SlashCommandBuilder,
  ModalActionRowComponentBuilder,
  CommandInteraction,
  TextInputBuilder,
  TextInputStyle,
  ModalBuilder,
  ActionRowBuilder
} from "discord.js";

import { Random } from "random-js";
import ObjectsLoader from "@thevoidcommunity/the-void-database/loaders/data/objects.loader";
import Ids from "utility/modals/custom-ids.modal";
import { Types } from "@voidy/types";

const customIds = Ids.getIds();
const objects = new ObjectsLoader().execute();

export default new Types.Discord.Command({
  data: new SlashCommandBuilder()
    .setName("telegram-say")
    .setDescription("Сообщение с помощью бота!")
    .setNameLocalizations({ ru: "отправить-в-телеграм", "en-US": "telegram-say" })
    .setDescriptionLocalizations({
      ru: "Сообщение в телеграм с помощью бота",
      "en-US": "Message into telegram using a bot"
    }),
  async execute(interaction: CommandInteraction) {
    if (!interaction.guild)
      return await interaction.reply({
        content: "Вы находитесь не в гильдии",
        ephemeral: true
      });

    const components = customIds.sayTelegramModal.components;
    const idea = objects.idea;

    const modal = new ModalBuilder()
      .setCustomId(customIds.sayTelegramModal.id)
      .setTitle("Ваше сообщение !");
    const randomNumber = new Random().integer(0, idea.length - 1);
    const placeholder = idea[randomNumber].ideaDetail;

    modal.addComponents(
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId(components.sayTelegramMessage)
          .setLabel("Ваше сообщение")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(4000)
          .setPlaceholder(
            placeholder.length <= 100
              ? placeholder
              : "Если сообщение будет больше 2к символов, оно отправиться в embed формате"
          )
      ),
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId(components.sayTelegramChannel)
          .setLabel("Ваш id канала")
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(30)
      )
    );

    await interaction.showModal(modal);
  }
});
