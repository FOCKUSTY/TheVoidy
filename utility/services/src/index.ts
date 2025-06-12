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

import DCLArrayService from "./service/array.service";
import DCLFilterService from "./service/filter.service";
import DCLOneTimeFunctionService from "./service/one-time-function.service";

export namespace Services.Loaders {
  export class ClientLoader extends DCLClientLoader {}
  export type Objects = IMTObjects;
}

export namespace Services {
  export class ArrayService extends DCLArrayService {}
  export class FilterService extends DCLFilterService {}
  export class OneTimeFunctionService<T, K> extends DCLOneTimeFunctionService<T, K> {}
}
