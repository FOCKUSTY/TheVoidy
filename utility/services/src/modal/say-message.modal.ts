import {
  Channel,
  ChannelType,
  EmbedBuilder,
  ModalSubmitInteraction,
  PermissionsBitField
} from "discord.js";

import DiscordModal from "./abstract.modal";

class Modal extends DiscordModal {
  public get id() {
    return "say-modal";
  }

  public get components() {
    return {
      sayMessage: "say-message",
      sayChannel: "say-channel"
    };
  }

  public async execute(interaction: ModalSubmitInteraction) {
    const { components } = this;

    const channelId: string = interaction.fields.getTextInputValue(components.sayChannel);
    const channel: Channel | undefined = interaction.client.channels.cache.get(channelId);

    if (!channel || !interaction.guild)
      return await interaction.reply({
        content: "Ошибка при поиске канала, попробуйте снова",
        ephemeral: true
      });

    if (!interaction.client.user) {
      return await interaction.reply({
        content: "Проблемы на нашей стороне...",
        ephemeral: true
      });
    }

    if (channel.type !== ChannelType.GuildText) {
      return await interaction.reply({
        content: "Ваш канал не является текстовым",
        ephemeral: true
      });
    }

    const permissions = channel.permissionsFor(interaction.client.user.id);

    if (
      !permissions ||
      permissions.has([
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ViewChannel
      ])
    ) {
      return await interaction.reply({
        content:
          "Сообщение не было доставлено на Ваш канал, возможны причины:\n" +
          "1. Ваш канал не является текстовым каналом\n" +
          "2. У меня не достаточно прав отправить сообщение на Ваш канал",
        ephemeral: true
      });
    }

    const message: string = interaction.fields.getTextInputValue(components.sayMessage);

    try {
      if (message.length > 2000) {
        const embed = new EmbedBuilder()
          .setColor(0x161618)
          .setAuthor({
            name: interaction.user.globalName || interaction.user.username,
            iconURL: interaction.user.avatarURL() || undefined
          })
          .setTitle(interaction.guild.name)
          .setDescription(message.replace(/\\\\n/g, "\n"))
          .setTimestamp();

        await channel.send({ embeds: [embed] });
      } else {
        await channel.send(`${message.replace(/\\\\n/g, "\n")}`);
      }

      const embed = new EmbedBuilder()
        .setColor(0x161618)
        .setAuthor({
          name: "The Void",
          iconURL: interaction.client.user.avatarURL() || undefined
        })
        .setTitle("Сообщение:")
        .setDescription(message.replace(/\\\\n/g, "\n"))
        .setTimestamp();

      return await interaction.reply({
        content: `Сообщение было доставлено на: ${channel}`,
        embeds: [embed],
        ephemeral: true
      });
    } catch (err) {
      return await interaction.reply({
        content:
          "Сообщение не было доставлено на Ваш канал, возможны причины:\n" +
          "Ваш канал не является текстовым каналом\n" +
          "У меня не достаточно прав отправить сообщение на Ваш канал" +
          "\n ## Ошибка:\n" +
          `\`\`\`${err}\`\`\``,
        ephemeral: true
      });
    }
  }
}

export default Modal;
