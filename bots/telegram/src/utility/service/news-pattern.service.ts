/**
 * Presets created for simple working with patterns
 */
export interface Presets {
  /**
   * name of repos
   * 
   * repo includes a orientations:
   * boolean value is orientation: backend, frontend, utiilty and etc
   * 
   * @example
   * repos: {
   *  "TheVoidy": {
   *    "bots": true,
   *    "utility": false
   *  }
   * }
   */
  repos?: {
    [repo_name: string]: { [orientation: string]: boolean };
  };

  /**
   * visualisation is a style of repos, orientations and etc
   * Workinkg on: telegram
   * In futute: discord
   * 
   * @requires repos must includes REPO_NAME
   * @requires orientation must includex ORIENTATION_NAME
   * 
   * All keywords:
   * @$Quote $Quote(NAME)
   * @$Bold $Bold(NAME)
   * @$Underline $Underline(NAME)
   * @$Italic $Italic(NAME)
   * @$Link $Link(NAME)
   * 
   * @example
   * visualisation {
   *  repos: "[- $Bold(REPO_NAME) -]",
   *  orientations: "— ORIENTATION_NAME"
   * }
   */
  visualisation?: {
    repos?: string;
    orientations?: string;
  };
}

class Service {
  public getPatternByRepo(
    repo: { name: string; link: string; }[],
    presets?: Presets
  ) {
    
  }
}

export default Service;
