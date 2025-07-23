import { ButtonBuilder, MessageComponentInteraction } from "discord.js";

export class Button<T = unknown> {
  public static name: string;
  public static builder: ButtonBuilder;

  declare execute: (interaction: MessageComponentInteraction) => Promise<T>;
}

export default Button;
