import {
  type blockchainTypes,
  createBlockchainDeploy,
  createLogger,
  tutorialConfig,
  tutorialConfigConst,
} from "@blockbash/common-be";
import { ReentrancyFundamentals } from "@lib/deploy";
/**
 * ContractNames.Attacker will try to exploit ContractNames.Vulnerable
 */
// config
const attackerContractName = tutorialConfigConst.ContractName.Attacker;
const tutorialGUID =
  tutorialConfigConst.TutorialGUID.reentrancyFundamentalsAttackLab;
const vulnerableContractName = tutorialConfigConst.ContractName.Vulnerable;
const challengeGroupGUID =
  tutorialConfigConst.ChallengeGroupGUID.reentrancyFundamentalsAttackPrompt;

const createDeployment: blockchainTypes.DeployFunction = async (hre) => {
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
