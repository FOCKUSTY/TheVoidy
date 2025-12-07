import { FilesLoader } from "./abstract-files.loader";

type Callback<T, K=void> = (data: {file: string, path: string, data: T}) => K;

export class JsFilesLoader<T> extends FilesLoader<T> {
  public override async execute<K=T>(format: Callback<T, K>, filter?: Callback<T>): Promise<K[]> {
    const { paths, files } = await this.resolveDir(this.dir);
    const output: K[] = [];

    for (const index in files) {
      const file = files[index];
      const path = paths[index];
      const data = require(path);

      if (filter?.({path, file, data})) {
        continue;
      }

      output.push(format({path, file, data}));
    }

    return output;
  }
}