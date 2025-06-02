import { Ai as OpenAi } from "@thevoidcommunity/the-void-database/ai/openai";
import { Models } from "@thevoidcommunity/the-void-database/ai/types";
import { ChatCompletion } from "openai/resources/chat/completions";
import { APIPromise } from "openai/core";

import { Types, Classes } from "@voidy/types";

import { Debug, Env } from "@voidy/develop";
import { Colors } from "f-formatter";

const promts = new Map<string, string>();

class Ai extends Classes.Ai {
  public chat(
    promt: string,
    text: string = "",
    model: Models = "gpt-4o-mini"
  ): Types.Response<APIPromise<ChatCompletion> | null> {
    if (!Env.env.OPEN_AI_KEY) {
      return {
        data: null,
        text: "Ключ к Open AI не найден.",
        type: 0
      };
    }

    try {
      const id = new Date().getTime().toString(16);
      promts.set(promt, id);

      Debug.Log([
        "Ввод запроса: " + Colors.bgCyan + id + Colors.magenta + ":",
        promt,
        "Модель: " + model
      ]);

      const data = new OpenAi(Env.env.OPEN_AI_KEY).chat(promt, { model: model });

      if (!data) {
        Debug.Error(new Error("Произошла ошибка с ответом."));

        return {
          data: null,
          text: "Произошла ошибка.",
          type: 0
        };
      }

      data.then((r) =>
        Debug.Log(["Ответ на запрос: " + id + ":", r.choices[0].message.content || ""])
      );

      return {
        data: data,
        text: `${text}\nМодель: ${model}\nВаш id: ${id}\n`,
        type: 1,
        dataContent: {
          text: ".choices[0].message.content"
        }
      };
    } catch (error) {
      Debug.Error(error);

      return {
        data: null,
        text: "Произошла ошибка",
        type: 0
      };
    }
  }
}

export default Ai;
