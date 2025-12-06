import { lstatSync, readdirSync } from "fs"
import { join } from "path";

export const DATA_PATH = join("./data");

export const getData = (): string[] => {
  try {
    const folder = lstatSync(DATA_PATH);

    if (folder.isBlockDevice()) {
      return [];
    }

    if (!folder.isDirectory()) {
      return [];
    }

    return readdirSync(DATA_PATH);
  } catch (error) {
    return [];
  }
}

export const DATA_CONTENT = getData();

export class Data {
  public static readonly path = DATA_PATH;
  public static readonly content = DATA_CONTENT;
}

export default Data;