import { APIPromise } from "openai/core";
import { Response } from "./response.type";
import { ChatCompletion } from "openai/resources/chat/completions";
import { Models } from "@thevoidcommunity/the-void-database/ai/types/models.types";

export abstract class Ai {
  public abstract chat(
    promt: string,
    text: string,
    model: Models
  ): Response<APIPromise<ChatCompletion> | null>;
}
