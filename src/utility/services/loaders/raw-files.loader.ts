import { readFile } from "fs/promises";

import FilesLoader from "./abstract-files.loader";

type Callback<T, K = void> = (data: { file: string; path: string; data: T }) => K;

export class RawFilesLoader<T extends string = string> extends FilesLoader<T> {
  public async execute<K = T>(format: Callback<T, K>, filter?: Callback<T>): Promise<K[]> {
    const { files, paths } = await this.resolveDir(this.dir);
    const output: K[] = [];

    for (const index in files) {
      const file = files[index];
      const path = paths[index];
      const data = (await readFile(path, "utf-8")) as T;

      if (filter?.({ file, path, data })) {
        continue;
      }

      output.push(format({ file, path, data }));
    }

    return output;
  }
}

export default RawFilesLoader;
