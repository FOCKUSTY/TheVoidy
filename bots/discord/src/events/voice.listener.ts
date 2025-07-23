import { Events, VoiceState } from "discord.js";

import tools from "tools/index";

export class Listener {
  public readonly name = Events.VoiceStateUpdate;
  public readonly tag = Events.VoiceStateUpdate;
  private readonly tool = new tools["voice-create"]();

  public async execute(oldVoiceState: VoiceState, newVoiceState: VoiceState) {
    this.tool.execute(oldVoiceState, newVoiceState);
  }
}

export default Listener;
