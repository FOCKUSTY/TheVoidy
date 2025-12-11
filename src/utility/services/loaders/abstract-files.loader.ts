import { join } from "path";
import { readdir, lstat } from "fs/promises";

export type Callback<T, K = void> = (data: { file: string; path: string; data: T }) => K;

export type CallbackParameters<T, K = void> = Parameters<Callback<T, K>>[0];

export abstract class FilesLoader<T> {
  public constructor(public readonly dir: string) {}

  abstract execute<K = T>(format: Callback<T, K>, filter?: Callback<T>): Promise<K[]>;

  protected async resolveDir(dir: string): Promise<{ paths: string[]; files: string[] }> {
    const directory = await readdir(dir, { recursive: true });

    const files: string[] = [];
    const paths: string[] = [];

    for (const file of directory) {
      const path = await this.resolvePath(join(dir, file));

      if (!path) {
        continue;
      }

      paths.push(path);
      files.push(file);
    }

    return {
      paths,
      files
    };
  }

  protected async resolvePath(path: string): Promise<string | null> {
    const stats = await lstat(path);

    if (stats.isDirectory()) {
      return null;
    }

    return path;
  }
}

export default FilesLoader;
