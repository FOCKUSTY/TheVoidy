/* eslint-disable */

import { TelegramInteraction as Interaction } from "../commands/interactions.type";
import { Response as ResponseType } from "./response.type";

export type SendData<Option, Response> = {
  message: Interaction;
  option: OptionType<Option>;
  response: ResponseType<Response>;
};

export type ExecuteData<Option, Response, ArgumentResponse = Response> = {
  send: (data: SendData<Option, ArgumentResponse>) => Promise<void>;
} & SendData<Option, Response>;

type OptionType<
  Response,
  FirstArgs extends unknown[] = unknown[],
  LastArgs extends unknown[] = unknown[],
  AddArgs extends unknown[] = unknown[],
  ArgumentResponse = Response
> = {
  command: string;
  option: string;
  error: string;
  text: string;
  id: string | number;

  execute?: (data: ExecuteData<any, Response, ArgumentResponse>) => void;
  function?: (...data: [...FirstArgs, ...AddArgs, ...LastArgs]) => Promise<ResponseType<Response>>;
  firstArgs?: FirstArgs;
  lastArgs?: LastArgs;
  addArgs?: AddArgs;
};

export { OptionType as Option };
