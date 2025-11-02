import { APIPromise } from "openai/core";
import { ChatCompletion } from "openai/resources/chat/completions";
import { Models } from "@thevoidcommunity/the-void-database/ai/types/models.types";

export abstract class Ai {
  public abstract chat(
    promt: string,
    model: Models
  ): APIPromise<ChatCompletion> | null;
}
