import {
  FullPresets,
  Repo,
  VisualisationFindFormatStyleRegExp,
  VisualisationFormattingRegExpsType,
  VisualisationKeys,
  RegExpsService
} from "v@types/services/news-pattern.type";

import { Types } from "v@types";
import { Format } from "telegraf";
import { FmtString } from "telegraf/typings/format";

const regexpsService = new RegExpsService();

enum VisualisationFormattingNames {
  repos = "REPO_NAME",
  areas = "AREA_NAME",
  items = "ITEM_NAME"
}

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
  ) {}

  private FmtState() {
    const fmt: Format.FmtString = {
      __to_nest: "",
      text: "",
      entities: []
    };

    const pushToFmt = (
      txt: string,
      type?: VisualisationFormattingRegExpsType,
      existedFmt: FmtString = { text: "", __to_nest: "" }
    ) => {
      if (type)
        fmt.entities.push({
          type: VisualisationFormattingRegExpsToTelegramFormatString[type],
          length: txt.length,
          offset: existedFmt.text.length + fmt.text.length + 1
        });

      fmt.text += `${txt}\n`;
    };

    const pushFmtToFmt = (data: Format.FmtString<string>) => {
      fmt.text += `${data.text}`;
      fmt.entities.push(...data.entities);
    };

    return [fmt, pushToFmt, pushFmtToFmt] as const;
  }

  private toFmtString(
    type: VisualisationKeys,
    names: string[],
    existedFmt: FmtString = { text: "", __to_nest: "" }
  ) {
    const [fmt, pushToFmt, pushFmtToFmt] = this.FmtState();

    for (const name of names) {
      if (!names.includes(name)) continue;

      const matchedFormatStyle = this.presets.visualisation[type].match(
        VisualisationFindFormatStyleRegExp
      );

      if (!matchedFormatStyle) {
        pushToFmt(
          this.presets.visualisation[type].replaceAll(VisualisationFormattingNames[type], name),
          undefined,
          existedFmt
        );
        continue;
      }

      const formatStyle = matchedFormatStyle[0] as VisualisationFormattingRegExpsType;
      const formatStyles = Array.from(
        new Set(regexpsService.FindAll(this.presets.visualisation[type], formatStyle))
      );

      if (formatStyles.length === 0) continue;

      const fullFormated: FmtString = {
        __to_nest: "",
        text: "",
        entities: []
      };

      fullFormated.text =
        regexpsService
          .FindLast(this.presets.visualisation[type], formatStyle)
          .replaceAll(VisualisationFormattingNames[type], name) + "\n";

      for (const style of formatStyles.toReversed()) {
        fullFormated.entities.push({
          type: VisualisationFormattingRegExpsToTelegramFormatString[style],
          length: fullFormated.text.length,
          offset: existedFmt.text.length
        });
      }

      pushFmtToFmt(fullFormated);
    }

    return fmt;
  }

  public generate() {
    const [output, , pushFmtToFmt] = this.FmtState();

    for (const repo of this.repos) {
      pushFmtToFmt(this.toFmtString("repos", [repo.name], output));

      const areas = this.presets.repos[repo.name];

      if (!areas) continue;

      const enabledAreas = Object.entries(areas)
        .filter((a) => a[1] === true)
        .map((a) => a[0]);

      if (enabledAreas.length === 0) continue;

      const areaFmt = this.toFmtString("areas", Object.keys(areas), output);
      pushFmtToFmt(areaFmt);
      pushFmtToFmt(this.toFmtString("items", ["example"], output));
    }

    return output;
  }
}

export default Service;
