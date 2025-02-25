import { ModalSubmitInteraction } from "discord.js";

abstract class DiscordModal {
  public abstract get id(): string;
  public abstract get components(): { [key: string]: string };
  public abstract execute(interaction: ModalSubmitInteraction): Promise<unknown>;
}

export default DiscordModal;
