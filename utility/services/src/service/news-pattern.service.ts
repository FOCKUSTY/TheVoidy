import NewsPatternValidator, {
  Presets,
  Repo,
  Formatting,
  FullPresets
} from "v@types/services/news-pattern.type";
import { Classes, Types } from "v@types";

import DiscordFormattingService from "./discord-formatting.service";
import TelegramFormattingService from "./telegram-formatting.service";

import { FmtString } from "telegraf/typings/format";

const formattingServices = {
  discord: DiscordFormattingService,
  telegram: TelegramFormattingService
} as const;

class Pattern {
  private readonly _repos: Repo[];
  private readonly _presets: FullPresets;

  private readonly _format: Types.Patterns.Formatting.IPatternService<string | FmtString>;

  public constructor(repos: Repo[], type: Formatting, presets?: Presets) {
    this._repos = repos;
    this._presets = new NewsPatternValidator(presets).execute();

    this._format = this.ChooseFormatType(type);
  }

  private ChooseFormatType(type: Formatting) {
    return new formattingServices[type](this._repos, this._presets);
  }

  public generate() {
    return this._format.generate();
  }

  public get repos() {
    return this._repos;
  }

  public get presets() {
    return this._presets;
  }
}

export default Pattern;
