import { AbstractActivities } from "../abstract.activities";
import { Data } from "../../data";

import { join } from "path";

export class KristyActivities extends AbstractActivities {
  public static readonly path = join(Data.path, "feature-activities", "kristy");

  public constructor() {
    super(KristyActivities.path);
  }
}

export default KristyActivities;
