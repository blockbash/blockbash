import {
  type blockchainTypes,
  createBlockchainDeploy,
  createLogger,
  tutorialConfig,
  tutorialConfigConst,
} from "@blockbash/common-be";
import { ReentrancyFundamentals } from "@lib/deploy";
// eslint-disable-next-line camelcase
import { type HardhatRuntimeEnvironment } from "hardhat/types";
/**
 * ContractNames.AttackerSolutionPattern0 will try to exploit ContractNames.Vulnerable
 */
// config
const attackerContractName =
  tutorialConfigConst.ContractName.AttackerSolutionPattern0;
const tutorialGUID =
  tutorialConfigConst.TutorialGUID.reentrancyFundamentalsAttackLab;
const vulnerableContractName = tutorialConfigConst.ContractName.Vulnerable;
const challengeGroupGUID =
  tutorialConfigConst.ChallengeGroupGUID
    .reentrancyFundamentalsAttackSolutionPattern0;

const createDeployment: blockchainTypes.DeployFunction = async (
  hre: HardhatRuntimeEnvironment,
): Promise<void> => {
  await new ReentrancyFundamentals({
    injectedDependencies: {
      blockchainDeploy: createBlockchainDeploy({ hre }),
      logger: createLogger(),
      tutorialConfig,
    },
  }).deploy({
    attackerContractName,
    challengeGroupGUID,
    tutorialGUID,
    vulnerableContractName,
  });
};

export default createDeployment;
createDeployment.tags = [challengeGroupGUID];
