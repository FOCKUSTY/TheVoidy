import { Env } from "@voidy/develop";

import {
  SlashCommandBuilder,
  ModalActionRowComponentBuilder,
  CommandInteraction,
  TextInputBuilder,
  TextInputStyle,
  ModalBuilder,
  ActionRowBuilder,
  MessageFlags
} from "discord.js";

import Ids from "utility/modals/custom-ids.modal";
import Command from "types/command.type";

const customIds = Ids.getIds();

export default new Command({
  data: new SlashCommandBuilder().setName("update").setDescription("Сообщение с помощью бота!"),
  async execute(interaction: CommandInteraction) {
    if (interaction.user.id !== Env.get("AUTHOR_ID"))
      return await interaction.reply({
        content: "У Вас нет прав на использование этой команды",
        flags: MessageFlags.Ephemeral
      });

    const components = customIds.updateModal.components;
    const modal = new ModalBuilder()
      .setCustomId(customIds.updateModal.id)
      .setTitle("Впишите обновления");

    modal.addComponents(
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId(components.ruText)
          .setLabel("Русский")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(3900)
      ),
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId(components.enText)
          .setLabel("Английский")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(3900)
      ),
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId(components.version)
          .setLabel("Версия")
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(30)
      )
    );

    await interaction.showModal(modal);
  }
});
