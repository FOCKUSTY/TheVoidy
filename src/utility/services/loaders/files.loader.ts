import { join } from "path";
import { readdir, lstat } from "fs/promises";

type Callback<T, K=void> = (path: string, data: T) => K;

export class FilesLoader<T> {
  public constructor(public readonly dir: string) {}

  public async execute<K=T>(format: Callback<T, K>, filter?: Callback<T>): Promise<K[]> {
    const files = await this.resolveDir(this.dir);
    const output: K[] = [];

    for (const file of files) {
      const fileData = require(file);

      if (filter?.(file, fileData)) {
        continue;
      }

      output.push(format(file, fileData));
    }

    return output;
  }

  private async resolveDir(dir: string): Promise<string[]> {
    const files = await readdir(dir);

    const output: string[] = [];

    for (const file of files) {
      const path = join(dir, file);
      const resolvedPath = await this.resolvePath(path);
      const toPush = Array.isArray(resolvedPath) ? resolvedPath : [resolvedPath];

      output.push(...toPush);
    }

    return output;
  }

  private async resolvePath(path: string): Promise<string | string[]> {
    const stats = await lstat(path);

    if (stats.isDirectory()) {
      return this.resolveDir(path);
    }

    return path;
  }
}
