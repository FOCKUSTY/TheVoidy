import type { Activity } from "@bots/discord/types/activity.type";

import { StandartActivities } from "./standart.activities";
import { TypifiendActivities } from "./typified.activities";

import { ObjectsData } from "../objects.data";

export class Activities {
  public async execute() {
    new ObjectsData().execute();

    const activities = [
      ...await new StandartActivities().execute(),
      ...await new TypifiendActivities().execute()
    ];

    return this.resolveVariables(activities);
  }

  private resolveVariable(activity: Activity): Activity {
    const { constants } = ObjectsData.value;

    let text = `${activity.text}`;

    for (const constant in constants) {
      const { template, value } = this.getConstantProperties(constant);

      if (!text.includes(template)) {
        continue;
      }

      text = text.replaceAll(template, value);
    }

    return {
      ...activity,
      text
    }
  }

  private getConstantProperties(constant: string) {
    const { constants } = ObjectsData.value;
    
    const value = constants[constant];

    return {
      name: constant, value,
      template: `$\{${constant}}`
    }
  }

  private resolveVariables(activities: Activity[]) {
    return activities.map(activity => this.resolveVariable(activity));
  }
}

export default Activities;
