import type { tutorialConfigTypes } from "@blockbash/common";
import type { ethTypes, loggerTypes } from "@blockbash/common/src";
import type { BigNumber } from "@ethersproject/bignumber";
import type { DeployFunction as HardhatDeployFunction } from "hardhat-deploy/types";

import { BlockchainDeploy } from "./blockchain";

interface DeployFunction extends HardhatDeployFunction {
  tags: tutorialConfigTypes.ChallengeGroupGUIDs;
}

interface BlockchainDeployDependencies {
  bigNumberLib: typeof BigNumber;
  ethLib: ethTypes.Eth;
  logger: loggerTypes.ILoggerMin;
}

export {
  BlockchainDeploy,
  type BlockchainDeployDependencies,
  type DeployFunction,
};
