import {
  FullPresets,
  Repo,
  VisualisationFindFormatStyleRegExp,
  VisualisationFormattingRegExps,
  VisualisationFormattingRegExpsType,
  VisualisationKeys,
  RegExpsService,
} from "v@types/services/news-pattern.type";

import { Types } from "v@types";
import { Format } from "telegraf";

const regexpsService = new RegExpsService(); 

enum VisualisationFormattingRegExpsToTelegramFormatString {
  Quote = "blockquote",
  Bold = "bold",
  Underline = "underline",
  Italic = "italic",
  Code = "code",
  Link = "url"
}

class Service implements Types.Patterns.Formatting.IPatternService<Format.FmtString<string>> {
  public constructor(
    public repos: Repo[],
    public presets: FullPresets
  ) {};

  private FmtState() {
    const fmt: Format.FmtString = {
      __to_nest: "",
      text: "",
      entities: []
    };

    const pushToFmt = (txt: string, type?: VisualisationFormattingRegExpsType) => {
      if (type)
        fmt.entities.push({
          type: VisualisationFormattingRegExpsToTelegramFormatString[type],
          length: txt.length,
          offset: fmt.text.length
        });

      fmt.text += txt;
    };

    const pushFmtToFmt = (fmt: Format.FmtString<string>) => {
      fmt.text += fmt.text;
      fmt.entities.push(...fmt.entities);
    };

    return [
      fmt,
      pushToFmt,
      pushFmtToFmt
    ] as const;
  }

  private toFmtString(
    type: VisualisationKeys,
    data: string[],
  ) {
    const [ fmt, pushToFmt ] = this.FmtState();

    for (const area of data) {
      if (!data[area]) continue;

      const matchedFormatStyle = this.presets.visualisation[type].match(VisualisationFindFormatStyleRegExp);
      
      if (!matchedFormatStyle) {
        pushToFmt(area);
        continue;
      }

      const formatStyle = matchedFormatStyle[0] as VisualisationFormattingRegExpsType;
      const formatStyles = Array.from(new Set(regexpsService.FindAll(this.presets.visualisation[type], formatStyle)));

      if (formatStyles.length === 0) continue;

      for (const style of formatStyles) {
        const data = regexpsService.FindData(style, this.presets.visualisation[type], "matched_data") as RegExpMatchArray;

        pushToFmt(data[0], style);
      };
    }

    return fmt;
  }

  public generate() {
    const [ output, , pushFmtToFmt ] = this.FmtState();

    const repoFmt = this.toFmtString("repos", this.repos.map(r => r.name));
    pushFmtToFmt(repoFmt);

    for (const repo of this.repos) {
      const areas = this.presets.repos[repo.name];
      const enabledAreas = Object.entries(areas).filter(a => a[1] === true).map(a => a[0]);

      if (enabledAreas.length === 0) continue;

      const areaFmt = this.toFmtString("areas", Object.keys(areas));
      pushFmtToFmt(areaFmt);

      pushFmtToFmt(this.toFmtString("items", ["example"]));
    };

    return output;
  }
}

export default Service;
