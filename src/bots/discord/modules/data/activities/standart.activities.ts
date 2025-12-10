import { Data } from "../data";
import { ActivitiesTemplate } from "./activities.template";

import { join } from "path";

export class StandartActivities extends ActivitiesTemplate {
  public static readonly path = join(Data.path, "activities");
  
  public constructor() {
    super(StandartActivities.path);
  }
}

export default StandartActivities;
