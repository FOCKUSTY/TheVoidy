import { join } from "node:path";

import { Data } from "./data";

import RawFilesLoader from "@utility/services/loaders/raw-files.loader";

const DATA_FILES = {
  idea: join(Data.path, "idea.json"),
  download: join(Data.path, "download.json"),
  names: join(Data.path, "names.json"),
  constants: join(Data.path, "constants.json")
} as const;

const FILES = {
  byFileName: DATA_FILES,
  byFilePath: Object.fromEntries(
    Object.keys(DATA_FILES).map((k) => [(DATA_FILES as Record<string, string>)[k], k])
  )
};

const ALL_FILES = Object.values(DATA_FILES as Record<string, string>);

export type IdeaType = {
  idea: string;
  ideaDetail: string;
};

export type DownloadType = string;
export type NameType = string;
export type ConstantsType = Record<string, string>;

export type ObjectsType = {
  idea: IdeaType[];
  download: DownloadType[];
  names: NameType[];
  constants: Record<string, string>;
};

const filesLoader = new RawFilesLoader(Data.path);

export class ObjectsData {
  private static _value: ObjectsType|null = null;

  private static formatFile({ data, path }: { data: string; path: string }) {
    return {
      [FILES.byFilePath[path]]: JSON.parse(data)
    };
  }

  private static filterFile({ path }: { path: string }) {
    return ALL_FILES.includes(path);
  }

  private static reduceAndConcatFiles<T extends Record<string, unknown>>(previous: T, current: T) {
    return {
      ...previous,
      ...current
    };
  }

  public static get value() {
    if (this._value === null) {
      throw new Error("Can not use object data, it is not loaded");
    }

    return this._value;
  }

  public async execute() {
    if (ObjectsData._value === null) {
      return this.load();
    }

    return ObjectsData._value;
  }

  private async load() {
    const files = await filesLoader.execute(ObjectsData.formatFile, ObjectsData.filterFile);
    const concatedFiles = <ObjectsType>files.reduce(ObjectsData.reduceAndConcatFiles);

    ObjectsData._value = concatedFiles;

    return concatedFiles;
  }

  public static [Symbol.iterator]() {
    const context = ObjectsData._value;

    return function* () {
      for (const k in context) {
        const key = k as keyof ObjectsType;

        yield {
          key,
          value: context[key],
          object: context
        };
      }
    };
  }

  public [Symbol.iterator]() {
    return ObjectsData[Symbol.iterator];
  }
}

export default ObjectsData;
