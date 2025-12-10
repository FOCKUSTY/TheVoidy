import { AbstractFeatureActivities } from "./abstract.feature";
import { Data } from "../../data";

import { join } from "path";

export class TypifiendActivities extends AbstractFeatureActivities {
  public static readonly path = join(Data.path, "feature-activities", "typified");

  public constructor() {
    super(TypifiendActivities.path);
  }
}

export default TypifiendActivities;
