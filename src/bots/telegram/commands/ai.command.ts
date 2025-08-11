import { options } from "../events/message.listener";

import { Models, OPENAI_MODELS } from "@thevoidcommunity/the-void-database/ai/types";
import { ChatCompletion } from "openai/resources/chat/completions";
import { APIPromise } from "openai/core";

import { Interaction } from "@telegram/types/interaction.type";
import TelegramCommand from "@telegram/types/command.type";
import { ExecuteData, Option, Response, Services } from "@types";

type FunctionDataType = APIPromise<ChatCompletion> | null;
type DefaultOption = Option<FunctionDataType, [], [], [string], { text: string }>;
type DefaultExectuteData = ExecuteData<
  DefaultOption,
  FunctionDataType,
  { text: string }
>;

export default class Command extends TelegramCommand {
  public constructor(services: Services) {
    super({
      name: "ai",
      options: ["promt"],
      async execute(interaction: Interaction) {
        const command = interaction.message.text.split(" ");
        const model: Models = OPENAI_MODELS.includes(command[1])
          ? (command[1] as Models)
          : "gpt-4o-mini";

        if (!interaction.from) return;

        const replyOptions: DefaultOption[] = [
          {
            command: "ai",
            option: "promt",
            error: "",
            text: "Введите Ваш запрос:",

            id: interaction.message.message_id
          },
          {
            command: "ai",
            option: "end",
            error: "Произошли проблемы...\nОшибка:\n%ERROR%",
            text: "%SUCCESS%\nОтвет:\n%MESSAGE%",
            function: async (promt: string): Promise<Response<FunctionDataType>> => {
              const data = services.ai.chat(promt, "Спасибо, что пользуетесь The Void", model);

              if (data.type === 0) return { data: null, text: "Error", type: 0 };

              return {
                data: data.data,
                text: "Ok",
                type: 1
              };
            },
            execute: (data: DefaultExectuteData) => {
              if (typeof data.response.data === "string") return;

              if (data.response.type === 0 || !data.response.data) return;

              data.message.reply("Запрос принят! Ждите ответа!");

              data.response.data.then((d) => {
                data.send({
                  ...data,
                  response: {
                    ...data.response,
                    data: {
                      text: d.choices[0].message.content || "null"
                    }
                  }
                });
              });
            },

            id: 0
          }
        ];

        options.set(`${interaction.from.id}`, replyOptions);

        await interaction.reply(replyOptions[0].text);
      }
    });
  }
}
