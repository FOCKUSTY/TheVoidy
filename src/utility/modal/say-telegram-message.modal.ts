import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";

import TelegramClient from 'telegram/utility/service/telegram.service';
import customIds from "./custom-ids.modal";

const SayTelegramMessage = async (interaction: ModalSubmitInteraction) => {
    const components = customIds.sayTelegramModal.components;

    const channelId: any = interaction.fields.getTextInputValue(components.sayTelegramChannel);
    const message: any = interaction.fields.getTextInputValue(components.sayTelegramMessage);

	try  {
		const embed = new EmbedBuilder()
			.setColor(0x161618)
			.setAuthor({
                name: 'The Void',
                iconURL: interaction.client.user.avatarURL() || undefined
            })
			.setTitle('Сообщение:')
			.setDescription(message.replaceAll('\\n', '\n'))
			.setTimestamp()
	
        await TelegramClient.SendMessage(channelId, `Сообщение с Discord от ${interaction.user.globalName
			? interaction.user.globalName
			: interaction.user.username
		}:\n${message}`);

		return await interaction.reply({
			content: `Сообщение было доставлено на: ${channelId}`,
			embeds: [embed],
            ephemeral: true
		});
	}
	catch (err) {
		return await interaction.reply({
			content: `Сообщение не было доставлено на Ваш канал \`\`\`${err}\`\`\``,
            ephemeral: true
		});
	};
};

export default SayTelegramMessage;