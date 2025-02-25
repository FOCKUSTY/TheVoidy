export type Response<T = undefined> = {
  text: string;
  type: 0 | 1;

  data: T;
  dataContent?: {
    text: string;
  };
};
