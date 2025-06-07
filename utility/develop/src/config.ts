import { join, normalize, parse } from "path";
import { Configurator } from "fock-logger";

const { config } = new Configurator({ dir: normalize(join(parse(__filename).dir, "\\..\\..\\..\\")) });

export { config };
