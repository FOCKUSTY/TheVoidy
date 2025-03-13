/*
	D{name} - Defaul import {name}
	IM{name} - Import {name}

	T{name} - Type {name}
	I{name} - Interface {name}

	E{name} - Enum {name}

	CL{name} - Class {name}
	ACL{name} - Abstact class {name}

	F{name} - Function {name}
	C{name} - Constant {name}
*/

import DCLClientLoader, { Objects as IMTObjects } from "./loaders/client.loader";

import DACLModal from "./modal/abstract.modal";
import DCLCustomIDs from "./modal/custom-ids.modal";

import DCLIdeaModal from "./modal/idea.modal";
import DCLSayDiscordMessageModal from "./modal/say-discord-message.modal";
import DCLSayTelegramMessageModal from "./modal/say-telegram-message.modal";
import DCLUpdateModal from "./modal/update.modal";

import DCLArrayService from "./service/array.service";
import DCLFilterService from "./service/filter.service";
import DCLOneTimeFunctionService from "./service/one-time-function.service";

import DCLDiscordFormattingService from "./service/discord-formatting.service";
import DCLTelegramFormattingService from "./service/telegram-formatting.service";
import DCLNewsPatternService from "./service/news-pattern.service";

export namespace Services.Format {
  export class DiscordFormattingService extends DCLDiscordFormattingService {};
  export class TelegramFormattingService extends DCLTelegramFormattingService {};
  export class NewsPatternService extends DCLNewsPatternService {};
}

export namespace Services.Loaders {
  export class ClientLoader extends DCLClientLoader {}
  export type Objects = IMTObjects;
}

export namespace Services.Modals {
  export abstract class Modal extends DACLModal {}
  export class CustomIDs extends DCLCustomIDs {}

  export class IdeaModal extends DCLIdeaModal {}
  export class SayDiscordMessageModal extends DCLSayDiscordMessageModal {}
  export class SayTelegramMessageModal extends DCLSayTelegramMessageModal {}
  export class UpdateModal extends DCLUpdateModal {}
}

export namespace Services {
  export class ArrayService extends DCLArrayService {}
  export class FilterService extends DCLFilterService {}
  export class OneTimeFunctionService<T, K> extends DCLOneTimeFunctionService<T, K> {}
}
