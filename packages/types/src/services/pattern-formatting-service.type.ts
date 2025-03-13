import { Repo, Presets } from "./news-pattern.type";

export interface Service<T = string> {
  readonly repos: Repo[];
  readonly presets: Presets;

  generate(): T;
}

export type CreateService<T = string> = (repos: Repo[], presets?: Presets) => Service<T>;
