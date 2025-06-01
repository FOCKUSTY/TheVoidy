import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ModalActionRowComponentBuilder,
  CommandInteraction,
  TextInputBuilder,
  TextInputStyle,
  ModalBuilder,
  ActionRowBuilder,
  ChannelType
} from "discord.js";

import { Random } from "random-js";
import ObjectsLoader from "@thevoidcommunity/the-void-database/loaders/data/objects.loader";
import { Services } from "@voidy/services";
import { Types } from "@voidy/types";

const customIds = Services.Modals.CustomIDs.getIds();
const objects = new ObjectsLoader().execute();

export default new Types.Discord.Command({
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Сообщение с помощью бота!")
    .setNameLocalizations({ ru: "отправить", "en-US": "say" })
    .setDescriptionLocalizations({
      ru: "Сообщение с помощью бота",
      "en-US": "Message using a bot"
    })
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageChannels & PermissionFlagsBits.ManageMessages
    ),

  async execute(interaction: CommandInteraction) {
    if (!interaction.guild)
      return await interaction.reply({
        content: "Вы находитесь не в гильдии",
        ephemeral: true
      });

    const components = customIds.sayModal.components;
    const idea = objects.idea;

    const modal = new ModalBuilder()
      .setCustomId(customIds.sayModal.id)
      .setTitle("Ваше сообщение !");
    const randomNumber = new Random().integer(0, idea.length - 1);
    const placeholder = idea[randomNumber].ideaDetail;

    const channels: [string, string][] = [];

    interaction.guild.channels.cache.forEach((channel) =>
      channel.type === ChannelType.GuildText ? channels.push([channel.id, channel.name]) : null
    );

    const randomNumberChannel = new Random().integer(0, channels.length - 1);

    modal.addComponents(
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId(components.sayMessage)
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
          .setCustomId(components.sayChannel)
          .setLabel("Ваш id канала")
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(30)
          .setPlaceholder(
            `Пример: ${channels[randomNumberChannel][0]} (${channels[randomNumberChannel][1].slice(0, 30)})`
          )
      )
    );

    await interaction.showModal(modal);
  }
});
