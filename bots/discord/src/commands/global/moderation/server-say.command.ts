import { Env } from "v@develop";

import {
  ActionRowBuilder,
  CommandInteraction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle
} from "discord.js";

import { Random } from "random-js";
import ObjectsLoader from "@thevoidcommunity/the-void-database/loaders/data/objects.loader";
import { Services } from "v@services";
import { Types } from "v@types";

const customIds = Services.Modals.CustomIDs.getIds();
const objects = new ObjectsLoader().execute();

export default new Types.Discord.Command({
  data: new SlashCommandBuilder().setName("server-say").setDescription("Сообщение с помощью бота!"),

  async execute(interaction: CommandInteraction) {
    if (interaction.user.id !== Env.get("AUTHOR_ID"))
      return await interaction.reply({
        content: "У Вас нет прав на использование этой команды",
        ephemeral: true
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
