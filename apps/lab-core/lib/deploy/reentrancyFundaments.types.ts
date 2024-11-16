import {
  type blockchainTypes,
  type loggerTypes,
  type tutorialConfigTypes,
} from "@blockbash/common-be";

interface ReentrancyFundamentalsDependencies {
  blockchainDeploy: blockchainTypes.BlockchainDeploy;
  logger: loggerTypes.ILogger;
  tutorialConfig: tutorialConfigTypes.TutorialsConfigOrchestrator;
}

export type { ReentrancyFundamentalsDependencies };
