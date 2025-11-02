import { Ai as OpenAi } from "@thevoidcommunity/the-void-database/ai/openai";
import { Models } from "@thevoidcommunity/the-void-database/ai/types";
import { ChatCompletion } from "openai/resources/chat/completions";
import { APIPromise } from "openai/core";

import { Debug, Env } from "@develop";
import { Colors } from "f-formatter";
import { Ai as AiClass } from "@types";

const promts = new Map<string, string>();

class Ai extends AiClass {
  public chat(
    promt: string,
    model: Models = "gpt-4o-mini"
  ): APIPromise<ChatCompletion> | null {
    if (!Env.env.OPEN_AI_KEY) {
      throw new Error("OPEN_AI_KEY");
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
        throw Debug.Error(new Error("Произошла ошибка с ответом."));
      }

      data.then((r) =>
        Debug.Log(["Ответ на запрос: " + id + ":", r.choices[0].message.content || ""])
      );

      return data;
    } catch (error) {
      throw Debug.Error(error);
    }
  }
}

export default Ai;
