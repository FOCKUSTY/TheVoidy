import { FeatureActivitiesTemplate } from "./feature.template";
import { Data } from "../../data";

import { join } from "path";

export class TypifiendActivities extends FeatureActivitiesTemplate {
  public static readonly path = join(Data.path, "feature-activities", "typified");

  public constructor() {
    super(TypifiendActivities.path);
  }
}

export default TypifiendActivities;
