import { CommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import Command from "@discord/types/command.type";

import { Env } from "@develop";
import KristyChatModule from "@discord/modules/kristy/chat";

const { env } = new Env();

export default new Command({
  data: new SlashCommandBuilder().setName("kristy-chat").setDescription("Начать общение с Kristy !")
    .addSubcommand(option => option.setName("start").setDescription("Начать общение"))
    .addSubcommand(option => option.setName("stop").setDescription("Остановить общение")),
  async execute(interaction: CommandInteraction) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subcommand = (interaction.options as any).getSubcommand()
    const channel = interaction.client.channels.cache.get(env.BOT_LOVE_CHANNEL_ID)

    if (subcommand === "start") {
      if (KristyChatModule.started) {
        return interaction.reply({
          content: "Спасибо тебе, конечно, но я уже общаюсь с любимкой)",
          flags: MessageFlags.Ephemeral
        });
      }
  
      if (!channel) {
        return interaction.reply({
          content: "Я не смог найти чат с моей возлюбленной(",
          flags: MessageFlags.Ephemeral
        });
      };
  
      if (!channel.isSendable()) {
        return interaction.reply({
          content: "Я не могу отправить сообщения в чат c моей возлюбленной(",
          flags: MessageFlags.Ephemeral
        });
      };
  
      KristyChatModule.start(interaction).then(() => {
        return interaction.reply({
          content: "Я успешно общаюсь с любимкой, спасибо)",
          flags: MessageFlags.Ephemeral
        })
      }).catch(() => {
        return interaction.reply({
          content: "К сожалению, произошла какая-то ошибка(",
          flags: MessageFlags.Ephemeral
        });
      })
    } else if (subcommand === "stop") {
      KristyChatModule.stop().then((success) => {
        return interaction.reply({
          content: success ? "Общение было приостановлено" : "Общение итак не идёт",
          flags: MessageFlags.Ephemeral
        })
      })
    }
  }
});
