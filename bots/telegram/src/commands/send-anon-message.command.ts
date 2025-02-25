import TelegramCommand from "v@types/commands/telegram-command.type";
import { Interaction } from "v@types/telegram/interaction.type";
import { ExecuteData, Option } from "v@types/telegram/options.type";

import { Message } from "telegraf/typings/core/types/typegram";
import { anonMessages, options } from "../events/message.listener";
import { Services } from "v@types/all/services.type";

type DefaultOption = Option<
  | string
  | undefined
  | {
      text: string;
      data: Message.TextMessage;
      userId: string | number;
    },
  [string],
  [string],
  [string]
>;
type DefaultExecuteData = ExecuteData<
  DefaultOption,
  | string
  | undefined
  | {
      text: string;
      data: Message.TextMessage;
      userId: string | number;
    }
>;

export default class Command extends TelegramCommand {
  public constructor(services: Services) {
    super({
      name: "send_anonimus_message",
      options: ["userId", "message"],
      async execute(interaction: Interaction) {
        if (!interaction.from) return;

        const replyOptions: DefaultOption[] = [
          {
            command: "send_anonimus_message",
            option: "userId",
            error: "",
            text: "Введите id того, кому нужно доставить!",

            id: interaction.message.message_id + 0
          },
          {
            command: "send_anonimus_message",
            option: "message",
            error: "",
            text: "Введите сообщение",

            id: interaction.message.message_id + 2
          },
          {
            command: "send_anonimus_message",
            option: "end",
            error: "Сообщение не было доставлено\nОшибка:\n%ERROR%",
            text: "%SUCCESS%\nСообщение:\n%MESSAGE%",
            function: services.telegram.SendAnonMessage,
            execute: (data: DefaultExecuteData) => {
              if (typeof data.response.data === "string") return;

              const id = data.response.data?.data?.message_id;
              const from = data.response.data?.userId;

              if (!id || !from) return;

              anonMessages.set(`${id}`, `${from}`);

              data.send(data);
            },

            lastArgs: [`${interaction.from.id}`],
            id: 0
          }
        ];

        options.set(`${interaction.from.id}`, replyOptions);

        await interaction.reply(replyOptions[0].text);
      },
      async executeFunc(interaction: Interaction, userId: number | string) {
        if (!interaction.from) return;

        const replyOptions: DefaultOption[] = [
          {
            command: "send_anonimus_message",
            option: "message",
            error: "",
            text: "Введите сообщение",

            id: interaction.message.message_id
          },
          {
            command: "send_anonimus_message",
            option: "end",
            error: "Сообщение не было доставлено\n\nОшибка:\n%ERROR%",
            text: "%SUCCESS%\nСообщение:\n%MESSAGE%",
            function: services.telegram.SendAnonMessage,
            execute: (data: DefaultExecuteData) => {
              if (typeof data.response.data === "string") return;

              const id = data.response.data?.data?.message_id;
              const from = data.response.data?.userId;

              if (!id || !from) return;

              anonMessages.set(`${id}`, `${from}`);

              data.send(data);
            },

            firstArgs: [`${userId}`],
            lastArgs: [`${interaction.from.id}`],
            id: 0
          }
        ];

        options.set(`${interaction.from.id}`, replyOptions);

        await interaction.reply("Спасибо, что пользуетесь The Void!\n" + replyOptions[0].text);
      }
    });
  }
}
