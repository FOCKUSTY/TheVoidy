import { ActivitiesTemplate } from "../activities.template";
import { Data } from "../../data";

import { join } from "path";

export class KristyActivities extends ActivitiesTemplate {
  public static readonly path = join(Data.path, "feature-activities", "kristy");

  public constructor() {
    super(KristyActivities.path);
  }
}

export default KristyActivities;
