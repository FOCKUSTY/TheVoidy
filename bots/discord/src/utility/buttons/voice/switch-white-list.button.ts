import { ButtonBuilder, ButtonStyle, MessageComponentInteraction } from "discord.js";
import AbstractButton from "../abstract.class";
import Switcher from "./switch-button.service";

export class Button implements AbstractButton {
  public static readonly name = "switch-white-list";
  public static readonly builder = new ButtonBuilder()
    .setCustomId("voice-" + Button.name)
    .setStyle(ButtonStyle.Primary)
    .setLabel("Вкл/Выкл белый список");

  public execute: (interaction: MessageComponentInteraction) => Promise<unknown>;

  public constructor() {
    this.execute = new Switcher(Button.name, "whiteList").execute;
  }
};

export default Button;
