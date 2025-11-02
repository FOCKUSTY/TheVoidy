import { join } from "path";
import { readdir, lstat } from "fs/promises";

type Callback<T> = (path: string, data: T) => void;

export class FilesLoader<T> {
  public constructor(public readonly dir: string) {}

  public async execute(callback?: Callback<T>): Promise<T[]> {
    const files = await this.resolveDir(this.dir);
    const output: T[] = [];

    for (const file of files) {
      const fileData = require(file);

      callback?.(file, fileData);
      output.push(fileData);
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
