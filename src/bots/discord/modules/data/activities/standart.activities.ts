import type { CallbackParameters } from "@utility/services/loaders/raw-files.loader";
import type { Activity } from "@bots/discord/types/activity.type";

import { Data } from "../data";
import { AbsctractActivities } from "./abstract.activities";

import { join } from "path";

export class StandartActivities extends AbsctractActivities {
  public static readonly path = join(Data.path, "activities");
  
  public constructor() {
    super(StandartActivities.path);
  }
  
  protected formatFiles({ data }: CallbackParameters): Activity[] {
    const activities = JSON.parse(data) as Activity[];
    return activities;
  }
}

export default StandartActivities;
