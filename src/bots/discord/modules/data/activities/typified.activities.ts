import type { CallbackParameters } from "@utility/services/loaders/raw-files.loader";
import type { Activity, FeatureActivityFile } from "@bots/discord/types/activity.type";

import { AbsctractActivities } from "./abstract.activities";
import { Data } from "../data";

import { join } from "path";

export class TypifiendActivities extends AbsctractActivities {
  public static readonly path = join(Data.path, "feature-activities", "typified");

  public constructor() {
    super(TypifiendActivities.path);
  }

  protected formatFiles({ data }: CallbackParameters): Activity[] {
    const rawFile = JSON.parse(data) as FeatureActivityFile;
    const activities = rawFile.activities.map(text => ({ text, type: rawFile.type }));

    return activities;
  }
}

export default TypifiendActivities;
