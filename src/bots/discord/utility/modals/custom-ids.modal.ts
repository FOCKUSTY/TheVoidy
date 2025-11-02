import DiscordModal, { IModalConstructor } from "./abstract.modal";

import SayMessage from "./say-discord-message.modal";
import Update from "./update.modal";
import IdeaModal from "./idea.modal";
import { Services } from "@types";

class CustomIds {
  private readonly _services: Services;

  public constructor(services: Services) {
    this._services = services;
  }

  public static getIds() {
    const ids: {
      [key: string]: {
        id: string;
        components: { [key: string]: string };
      };
    } = {};

    for (const key in this.ids) {
      const modal = this.ids[key];

      ids[key] = {
        id: modal.prototype.id,
        components: modal.prototype.components
      };
    }

    return ids;
  }

  static get ids(): { [key: string]: IModalConstructor } {
    return {
      sayModal: SayMessage,
      updateModal: Update,
      ideaModal: IdeaModal
    };
  }

  get ids(): { [key: string]: DiscordModal } {
    return {
      sayModal: new SayMessage(),
      updateModal: new Update(this._services),
      ideaModal: new IdeaModal()
    };
  }
}

export default CustomIds;
