import { Env } from "v@develop";

import { EmbedBuilder, ModalSubmitInteraction, TextChannel } from "discord.js";
import DiscordModal from "./abstract.modal";

class Modal extends DiscordModal {
  public get id(): string {
    return "idea-modal";
  }

  public get components(): { [key: string]: string } {
    return {
      title: "idea-title",
      description: "idea-description"
    };
  }

  public async execute(interaction: ModalSubmitInteraction) {
    const { components } = this;

    const channel = interaction.client.channels.cache.get(
      Env.env.IDEA_CHANNEL_ID
    ) as TextChannel;

    const title = interaction.fields.getTextInputValue(components.title);
    const description = interaction.fields.getTextInputValue(components.description);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.globalName ? interaction.user.globalName : interaction.user.username,
        iconURL: interaction.user.avatarURL() || undefined
      })
      .setThumbnail(interaction.guild?.iconURL())
      .setTitle(title)
      .setDescription(description)
      .setFields([
        {
          name: "Пользователь",
          value: `<@${interaction.user.id}>`,
          inline: true
        },
        {
          name: "Сервер",
          value: interaction.guild?.name || "В личных сообщениях",
          inline: true
        }
      ])
      .setFooter({
        text: "The Void Community",
        iconURL: undefined // Env.get("GUILD_ICON_URL")
      })
      .setTimestamp();

    channel.sendTyping();

    setTimeout(async () => {
      const message = await channel.send({ embeds: [embed] });

      message.react("🎩");
      message.react("❌");
      message.react("💜");

      message.startThread({
        name: title,
        reason: description
      });
    }, 3000);

    return interaction.reply({
      content: "Ваша идея была доставлена",
      ephemeral: true,
      embeds: [embed]
    });
  }
}

export default Modal;
