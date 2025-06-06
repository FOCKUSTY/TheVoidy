import { Env } from "@voidy/develop";

import { EmbedBuilder, MessageFlags, ModalSubmitInteraction } from "discord.js";

import { Types } from "@voidy/types";
import DiscordModal from "./abstract.modal";

class Modal extends DiscordModal {
  private readonly _services: Types.Services;

  public constructor(services: Types.Services) {
    super();

    this._services = services;
  }

  public get id(): string {
    return "update-modal";
  }

  public get components(): { [key: string]: string } {
    return {
      version: "update-version",
      ruText: "update-ru-text",
      enText: "update-en-text"
    };
  }

  public async execute(interaction: ModalSubmitInteraction) {
    const { discord, telegram } = this._services;
    const { components } = this;

    const version: string = interaction.fields.getTextInputValue(components.version);
    const ru: string = interaction.fields.getTextInputValue(components.ruText);
    const en: string = interaction.fields.getTextInputValue(components.enText);

    try {
      if (
        ru.length > 2000 ||
        en.length > 2000 ||
        `${version} ${ru} ${version} ${en}`.length >= 2000
      ) {
        const embeds: EmbedBuilder[] = [];

        for (const text of [ru, en]) {
          embeds.push(
            new EmbedBuilder()
              .setColor(0x161618)
              .setAuthor({
                name: interaction.user.globalName || interaction.user.username,
                iconURL: interaction.user.avatarURL() || undefined
              })
              .setTitle(
                interaction.guild?.name || interaction.user.globalName || interaction.user.username
              )
              .setDescription(`# ${version}\n${text.replace(/\\\\n/g, "\n")}`)
              .setTimestamp()
          );
        }

        discord.SendMessage(Env.env.CHANGELOG_DISCORD_CHANNEL_ID, embeds);
        telegram.SendMessage(Env.env.CHANGELOG_TELEGRAM_CHANNEL_ID, `${version}\n${ru}`);
      } else {
        discord.SendMessage(
          Env.env.CHANGELOG_DISCORD_CHANNEL_ID,
          `# ${version}\n${ru}\n# ${version}\n${en}`
        );
        telegram.SendMessage(Env.env.CHANGELOG_TELEGRAM_CHANNEL_ID, `${version}\n${ru}`);
      }

      return interaction.reply({
        content: `Сообщение было доставлены в Telegram и Discord`,
        flags: MessageFlags.Ephemeral
      });
    } catch (err) {
      return interaction.reply({
        content: `Сообщение не было доставлено на Ваш канал, возможны причины:\n\
				Ваш канал не является текстовым каналом\n\
				У меня не достаточно прав отправить сообщение на Ваш канал\n\
				## Ошибка:\n\
				\`\`\`${err}\`\`\``,
        flags: MessageFlags.Ephemeral
      });
    }
  }
}

export default Modal;
