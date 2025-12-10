import type { Activity } from "@bots/discord/types/activity.type";

import { TypifiendActivities } from "./typified.activities";
import { KristyActivities } from "./kristy.activities";

import { ObjectsData } from "../../objects.data";

export class FeatureActivities {
  public async execute(): Promise<Activity[]> {
    await new ObjectsData().execute();

    const activities = [
      ...(await new TypifiendActivities().execute()),
      ...(await new KristyActivities().execute())
    ];

    return activities;
  }
}

export default FeatureActivities;
