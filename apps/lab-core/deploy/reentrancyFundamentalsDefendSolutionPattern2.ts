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
 ContractNames.AttackerSolutionPattern0 will try to exploit ContractNames.VulnerableSolutionPattern3.sol
 */
const attackerContractName =
  tutorialConfigConst.ContractName.AttackerSolutionPattern0;
const tutorialGUID =
  tutorialConfigConst.TutorialGUID.reentrancyFundamentalsDefendLab;
const vulnerableContractName =
  tutorialConfigConst.ContractName.VulnerableSolutionPattern2;
const challengeGroupGUID =
  tutorialConfigConst.ChallengeGroupGUID
    .reentrancyFundamentalsDefendSolutionPattern2;
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
