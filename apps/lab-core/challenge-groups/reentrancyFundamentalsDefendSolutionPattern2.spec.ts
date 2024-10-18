import {
  type blockchainTypes,
  challengeParser,
  createBlockchainDeploy,
  tutorialConfigConst,
} from "@blockbash/common-be";
import { type AttackerSolutionPattern0 } from "@typechain";
import hre from "hardhat";
import { challengeEnv, ethTest } from "lib/challenge";
import "mocha";
/* Configuration Values */
const testGroupName =
  tutorialConfigConst.ChallengeGroupGUID
    .reentrancyFundamentalsDefendSolutionPattern2;
type AttackerContractType = AttackerSolutionPattern0;
const attackerContractName =
  tutorialConfigConst.ContractName.AttackerSolutionPattern0;
const vulnerableContractName =
  tutorialConfigConst.ContractName.VulnerableSolutionPattern2;

/* Setup Logic that applies to all test envs */
describe(testGroupName, function (): void {
  let blockchainDeploy: blockchainTypes.BlockchainDeploy;
  let attackerContract: AttackerContractType;

  beforeEach(async function (): Promise<void> {
    blockchainDeploy = createBlockchainDeploy({ hre });
    await blockchainDeploy.deployContractsByTags({
      tags: [testGroupName],
    });
    attackerContract = (await blockchainDeploy.getDeployedContract({
      contractName: attackerContractName,
    })) as AttackerContractType;
  });

  // ContractNames.AttackerSolutionPattern0 will try to exploit ContractNames.VulnerableSolutionPattern2.sol
  // eslint-disable-next-line mocha/no-setup-in-describe
  challengeEnv.getAutomationEnvDescribe({
    fn() {
      it(
        tutorialConfigConst.ChallengeDescriptions
          .shouldNotBeAbleToStealAllEthFromVulnerableContract,
        async function (): Promise<void> {
          await ethTest.useAttackToDrainAllFunds({
            attacker: attackerContract,
            attackerContractName,
            challengeParser,
            deployer: blockchainDeploy,
            shouldWork: false,
            vulnerableContractName,
          });
        },
      );
    },
    testGroupName,
  });
});
