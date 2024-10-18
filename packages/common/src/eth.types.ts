import { type ethers } from "ethers";

import { Eth } from "./eth";
import { type ILoggerMin } from "./logger.types";

interface EthDependencies {
  ethLib: typeof ethers;
  logger: ILoggerMin;
}

export { Eth, type EthDependencies };
