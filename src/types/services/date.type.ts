export type Time =
  | {
      seconds?: number;
      minutes?: number;
      hour?: number;
      day: number;
      month: number;
      year: number;
    }
  | [number, number, number];
