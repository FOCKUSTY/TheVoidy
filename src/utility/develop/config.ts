import { Configurator } from "fock-logger/config";
import { join, normalize, parse } from "path";

const { config } = new Configurator({
  dir: normalize(join(parse(__filename).dir, "..", "..", "..")),
  create_file: true,
  logging: true,
  level: "info"
});

export { config };
