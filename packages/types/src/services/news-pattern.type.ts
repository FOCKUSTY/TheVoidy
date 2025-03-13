export const VISUALISATION_ITEMS = ["repo", "area", "item"] as const;

export type VisualisationItems = `${Uppercase<(typeof VISUALISATION_ITEMS)[number]>}_NAME`;
export type VisualisationKeys = `${(typeof VISUALISATION_ITEMS)[number]}s`;

export const VISUALISATION_KEYS: readonly [
  "repos",
  "areas",
  "items"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
] = VISUALISATION_ITEMS.map((i) => i + "s") as any;

export const DEFAULT_PRESETS: PresetsDefault = {
  visualisation: {
    repos: "$Code([ REPO_NAME ])",
    areas: "— AREA_NAME",
    items: " \u00D7 ITEM_NAME"
  }
};

export interface LazyPresets {
  repos?: {
    [repo_name: string]: { [area: string]: boolean };
  };
  visualisation?: Partial<Record<VisualisationKeys, string>>;
}

/**
 * Presets created for simple working with patterns
 */
export interface Presets {
  /**
   * name of repos
   *
   * repo includes a areas:
   * boolean value is areas: backend, frontend, utiilty and etc
   *
   * @example
   * repos: {
   *  "TheTypes": {
   *    "bots": true,
   *    "utility": false
   *  }
   * }
   */
  repos?: {
    [repo_name: string]: { [area: string]: boolean };
  };

  /**
   * visualisation is a style of repos, areas and etc
   * Workinkg on: telegram
   * In futute: discord
   *
   * @requires repos must includes REPO_NAME
   * @requires area must includes AREA_NAME
   *
   * All keywords:
   * @$Quote $Quote(NAME)
   * @$Bold $Bold(NAME)
   * @$Underline $Underline(NAME)
   * @$Italic $Italic(NAME)
   * @$Code $Code(NAME)
   * @$Link $Link(NAME, LINK)
   *
   * @example
   * visualisation {
   *  repos: "$Quote([ $Bold(REPO_NAME) ])",
   *  areas: "— AREA_NAME"
   * }
   */
  visualisation?: {
    /**
     * @requires REPO_NAME
     */
    repos?: string;
    /**
     * @requires AREA_NAME
     */
    areas?: string;
    /**
     * @requires ITEM_NAME
     */
    items?: string;
  };
}

export type RequiredObject<T> = Required<
  T extends object
    ? {
        [P in keyof T]: Required<T[P]>;
      }
    : T
>;
export type PresetsDefault = Required<
  RequiredObject<{
    [P in keyof Omit<Presets, "repos">]: RequiredObject<Omit<Presets, "repos">[P]>;
  }>
>;
export type FullPresets = RequiredObject<Presets> & Pick<Presets, "repos">;

export const FORMATTING = ["discord", "telegram"] as const;
export type Formatting = (typeof FORMATTING)[number];
export type Repo = { name: string; link: string };

export const VisualisationFindFormatStyleRegExp =
  /\$Quote|Bold|Underline|Italic|Code|Link\([\w\W]+\)/;
export const VisualisationFormattingRegExps = {
  Quote: /\$Quote\([\w\W]+\)/,
  Bold: /\$Bold\([\w\W]+\)/,
  Underline: /\$Underline\([\w\W]+\)/,
  Italic: /\$Italic\([\w\W]+\)/,
  Code: /\$Code\([\w\W]+\)/,
  Link: /\$Link\([\w\W]+, [\w\W]+\)/
} as const;

export type VisualisationFormattingRegExpsType = keyof typeof VisualisationFormattingRegExps;

export class RegExpsService {
  public FindAll = (text: string, firstFormat: VisualisationFormattingRegExpsType) => {
    const formats: VisualisationFormattingRegExpsType[] = [firstFormat];

    const getFormats = (txt: string, format: VisualisationFormattingRegExpsType) => {
      const data = txt.match(VisualisationFormattingRegExps[format]);
      const name = this.FindData(format, data[0], "name") as string;

      const nextFormatMatched = name.match(VisualisationFindFormatStyleRegExp);

      if (!nextFormatMatched) return;

      const nextFormat = nextFormatMatched[0] as VisualisationFormattingRegExpsType;

      formats.push(nextFormat);
      getFormats(name, nextFormat);
    };

    getFormats(text, firstFormat);

    return formats;
  };

  public FindData = (
    type: VisualisationFormattingRegExpsType,
    text: string,
    returnData: "matched_data" | "expression" | "name" = "matched_data"
  ) => {
    const data = text.match(VisualisationFormattingRegExps[type]);

    switch (returnData) {
      case "matched_data":
        return data;

      case "expression":
        return data[0];

      case "name":
        return data[0].slice(type.length + 2, data[0].length - 1);

      default:
        return data[0].slice(type.length + 2, data[0].length - 1);
    }
  };
}

class Validator {
  public constructor(private readonly _presets: Presets) {}

  private getVisualisationType(type: VisualisationKeys): VisualisationItems {
    return (type.slice(0, type.length - 1).toUpperCase() + "_NAME") as VisualisationItems;
  }

  private VisualisationValidator(): PresetsDefault["visualisation"] {
    const output: PresetsDefault["visualisation"] = DEFAULT_PRESETS.visualisation;

    if (!this._presets.visualisation) return DEFAULT_PRESETS.visualisation;

    const keys = VISUALISATION_KEYS;

    for (const key of keys) {
      if (!this._presets.visualisation[key]) continue;

      const name = this.getVisualisationType(key);

      if (!output[key].includes(name)) {
        console.error("A data " + output[key] + " doesn't includes a required " + name + " !");
        continue;
      }

      output[key] = this._presets.visualisation[key];
    }

    return output;
  }

  public execute(): FullPresets {
    const visualisation = this.VisualisationValidator();

    return {
      repos: this._presets.repos,
      visualisation
    };
  }
}

export default Validator;
