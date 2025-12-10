import { ObjectsData } from "../objects.data";

import { RawFilesLoader, CallbackParameters } from "@utility/services/loaders/raw-files.loader";
import { Activity } from "@bots/discord/types/activity.type";

const objectsData = new ObjectsData();

export class ActivitiesTemplate {
  public readonly loader: RawFilesLoader<string>;

  public constructor(
    public readonly path: string
  ) {
    this.loader = new RawFilesLoader(this.path);
  }
  
  public async execute() {
    await objectsData.execute();

    const data = await this.loader.execute(this.formatFiles, this.filterFiles);
    return this.flatMap(data);
  }

  protected flatMap(data: Activity[][]) {
    return data.flatMap(e => e);
  }

  protected filterFiles(data: CallbackParameters): boolean {
    return Boolean(data);
  }

  protected formatFiles({ data }: CallbackParameters): Activity[] {
    const activities = JSON.parse(data) as Activity[];
    return activities;
  }
}

export default ActivitiesTemplate;
