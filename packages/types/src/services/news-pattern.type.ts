export const VISUALISATION_ITEMS = ["repo", "commit"] as const;

export type VisualisationItems = `${Uppercase<(typeof VISUALISATION_ITEMS)[number]>}_NAME`;
export type VisualisationKeys = `${(typeof VISUALISATION_ITEMS)[number]}s`;

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

export const VISUALISATION_KEYS: readonly [
  "repos",
  "commits"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
] = VISUALISATION_ITEMS.map((i) => i + "s") as any;

export const DEFAULT_PRESETS: PresetsDefault = {
  visualisation: {
    repos: "`[ REPO_NAME ]`",
    commits: " \u2A2F COMMIT_NAME",
    dates: "  __\u2A2F\u2A2F\u2A2F DATE \u2A2F\u2A2F\u2A2F__",
    branches: "  __=== BRANCH_NAME ===__"
  }
};

export interface LazyPresets {
  repos?: {
    [repo_name: string]: string[];
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
   *  "TheTypes": ["some-commit1", "some-commit2"]
   * }
   */
  repos?: {
    [repo_name: string]: string[];
  };

  /**
   * visualisation is a style of repos, areas and etc
   * Workinkg on: telegram
   * In futute: discord
   *
   * @requires repos must includes REPO_NAME
   * @requires commits must includes COMMIT_NAME
   * @requires dates must includes DATE
   * @requires branches must includes BRANCH_NAME
   *
   * @example
   * visualisation {
   *  repos: "`[ REPO_NAME ]`",
   *  commits: " ⨯ COMMIT_NAME",
   *  date: "  __⨯⨯⨯ DATE ⨯⨯⨯__",
   *  branchs: "  __=== BRANCH_NAME ===__"
   * }
   */
  visualisation?: {
    /**
     * @requires REPO_NAME
     */
    repos?: string;
    /**
     * @requires COMMIT_NAME
     */
    commits?: string;

    /**
     * @requires DATE
     */
    dates?: string;

    /**
     * @requires BRANCH_NAME
     */
    branches?: string;
  };
}

export const FORMATTING = ["discord", "telegram"] as const;
export type Formatting = (typeof FORMATTING)[number];
export type Repo = { name: string; link: string };

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
