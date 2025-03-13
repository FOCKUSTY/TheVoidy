import { Types } from "v@types";
import { FullPresets, Repo } from "v@types/services/news-pattern.type";

class Service implements Types.Patterns.Formatting.IPatternService {
  public constructor(
    public repos: Repo[],
    public presets: FullPresets
  ) {};

  public generate(): string {
    return "the method is not implemented";
  }
}

export default Service;
