import { Data } from "../data";
import { AbstractActivities } from "./abstract.activities";

import { join } from "path";

export class StandartActivities extends AbstractActivities {
  public static readonly path = join(Data.path, "activities");
  
  public constructor() {
    super(StandartActivities.path);
  }
}

export default StandartActivities;
