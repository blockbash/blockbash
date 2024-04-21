import type { ethTypes, loggerTypes } from "@blockbash/common/src"

import type { BigNumber } from "@ethersproject/bignumber"

import { BlockchainDeploy } from "./blockchain"

interface BlockchainDeployDependencies {
  bigNumberLib: typeof BigNumber
  ethLib: ethTypes.Eth
  logger: loggerTypes.ILoggerMin
}

export { BlockchainDeploy, type BlockchainDeployDependencies }
