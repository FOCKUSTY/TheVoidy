import type { CallbackParameters } from "@utility/services/loaders/raw-files.loader";
import type { Activity, FeatureActivityFile } from "@bots/discord/types/activity.type";

import { ActivitiesTemplate } from "../activities.template";

export class FeatureActivitiesTemplate extends ActivitiesTemplate {
  protected override formatFiles({ data }: CallbackParameters): Activity[] {
    const rawFile = JSON.parse(data) as FeatureActivityFile;
    const activities = rawFile.activities.map((text) => ({ text, type: rawFile.type }));

    return activities;
  }
}

export default FeatureActivitiesTemplate;
