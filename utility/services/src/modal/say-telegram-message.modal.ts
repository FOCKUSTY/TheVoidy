import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { Voidy } from "v@types";
import DiscordModal from "./abstract.modal";

class Modal extends DiscordModal {
  private readonly _services: Voidy.Services;

  public constructor(services: Voidy.Services) {
    super();

    this._services = services;
  }

  public get id() {
    return "say-telegram-modal";
  }

  public get components() {
    return {
      sayTelegramMessage: "say-telegram-message",
      sayTelegramChannel: "say-telegram-channel"
    };
  }

  public async execute(interaction: ModalSubmitInteraction) {
    const { components } = this;

    const channelId: string = interaction.fields.getTextInputValue(components.sayTelegramChannel);
    const message: string = interaction.fields.getTextInputValue(components.sayTelegramMessage);

    try {
      const embed = new EmbedBuilder()
        .setColor(0x161618)
        .setAuthor({
          name: "The Void",
          iconURL: interaction.client.user.avatarURL() || undefined
        })
        .setTitle("Сообщение:")
        .setDescription(message.replace(/\\\\n/g, "\n"))
        .setTimestamp();

      this._services.telegram.SendMessage(
        channelId,
        `Сообщение с Discord от ${
          interaction.user.globalName ? interaction.user.globalName : interaction.user.username
        }:\n${message}`
      );

      return interaction.reply({
        content: `Сообщение было доставлено на: ${channelId}`,
        embeds: [embed],
        ephemeral: true
      });
    } catch (err) {
      return interaction.reply({
        content: `Сообщение не было доставлено на Ваш канал \`\`\`${err}\`\`\``,
        ephemeral: true
      });
    }
  }
}

export default Modal;
