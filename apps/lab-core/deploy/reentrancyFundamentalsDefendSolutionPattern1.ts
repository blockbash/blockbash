import {
  type blockchainTypes,
  createBlockchainDeploy,
  createLogger,
  tutorialConfig,
  tutorialConfigConst,
} from "@blockbash/common-be";
import { ReentrancyFundamentals } from "@lib/deploy";
import { type HardhatRuntimeEnvironment } from "hardhat/types";
/*
 ContractNames.AttackerSolutionPattern0 will try to exploit ContractNames.VulnerableSolutionPattern1
 */
// config
const attackerContractName =
  tutorialConfigConst.ContractName.AttackerSolutionPattern0;
const tutorialGUID =
  tutorialConfigConst.TutorialGUID.reentrancyFundamentalsDefendLab;
const vulnerableContractName =
  tutorialConfigConst.ContractName.VulnerableSolutionPattern1;
const challengeGroupGUID =
  tutorialConfigConst.ChallengeGroupGUID
    .reentrancyFundamentalsDefendSolutionPattern1;
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