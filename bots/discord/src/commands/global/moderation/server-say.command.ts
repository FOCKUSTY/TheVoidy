import { Env } from "@voidy/develop";

import {
  ActionRowBuilder,
  CommandInteraction,
  MessageFlags,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";

import { Random } from "random-js";
import ObjectsLoader from "@thevoidcommunity/the-void-database/loaders/data/objects.loader";
import Ids from "utility/modals/custom-ids.modal";
import Command from "types/command.type";

const customIds = Ids.getIds();
const objects = new ObjectsLoader().execute();

export default new Command({
  data: new SlashCommandBuilder().setName("server-say").setDescription("Сообщение с помощью бота!"),

  async execute(interaction: CommandInteraction) {
    if (interaction.user.id !== Env.get("AUTHOR_ID"))
      return await interaction.reply({
        content: "У Вас нет прав на использование этой команды",
        flags: MessageFlags.Ephemeral
      });

    const components = customIds.sayModal.components;
    const idea = objects.idea;

    const modal = new ModalBuilder()
      .setCustomId(customIds.sayModal.id)
      .setTitle("Ваше сообщение !");

    const randomNumber = new Random().integer(0, idea.length - 1);
    const placeholder = idea[randomNumber].ideaDetail;

    modal.addComponents(
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId(components.sayMessage)
          .setLabel("Ваше сообщение")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(4000)
          .setPlaceholder(placeholder)
      ),
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId(components.sayChannel)
          .setLabel("Ваш id канала")
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(30)
      )
    );

    await interaction.showModal(modal);
  }
});
