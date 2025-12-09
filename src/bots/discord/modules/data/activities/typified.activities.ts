import { join } from "path";

import { ObjectsData } from "../objects.data";
import { Data } from "../data";

import { RawFilesLoader, Callback } from "@utility/services/loaders/raw-files.loader";
import { Activity } from "@bots/discord/types/activity.type";

type CallbackType = Parameters<Callback<string, void>>[0];

type FileType = {
  type: string,
  activities: string[]
}

type FormatFilesReturnType = { file: string, activities: Activity[] };

const objectsData = new ObjectsData();

export class TypifiendActivities {
  public static readonly path = join(Data.path, "feature-activities", "typified");
  
  private static formatFiles({ data, file }: CallbackType): FormatFilesReturnType {
    const rawFile = JSON.parse(data) as FileType;
    const activities = rawFile.activities.map(text => ({ text, type: rawFile.type }));

    return { file, activities };
  }

  private static filterFiles({ data }: CallbackType) {
    return data;
  }

  private static flatMap(data: FormatFilesReturnType[]) {
    return data.flatMap(element => element.activities);
  }

  public constructor(
    public readonly loader: RawFilesLoader<string> = new RawFilesLoader(TypifiendActivities.path)
  ) {}

  public async execute() {
    await objectsData.execute();

    const data = await this.loader.execute(TypifiendActivities.formatFiles, TypifiendActivities.filterFiles);
    return TypifiendActivities.flatMap(data);
  }
}

export default TypifiendActivities;
