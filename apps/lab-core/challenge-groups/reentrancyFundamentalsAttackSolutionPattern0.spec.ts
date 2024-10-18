import {
  type blockchainTypes,
  challengeParser,
  createBlockchainDeploy,
  tutorialConfigConst,
} from "@blockbash/common-be";
import { type AttackerSolutionPattern0 } from "@typechain";
import hre from "hardhat";
import { challengeEnv, errorTest, ethTest } from "lib/challenge";
import "mocha";
/* Configuration Values */
const testGroupName =
  tutorialConfigConst.ChallengeGroupGUID
    .reentrancyFundamentalsAttackSolutionPattern0;
const attackerContractName =
  tutorialConfigConst.ContractName.AttackerSolutionPattern0;
type AttackerContractType = AttackerSolutionPattern0;
const vulnerableContractName = tutorialConfigConst.ContractName.Vulnerable;

/* Setup Logic that applies to all test envs */
describe(testGroupName, function (): void {
  let attackerSolutionContract: AttackerContractType;
  let blockchainDeploy: blockchainTypes.BlockchainDeploy;
  beforeEach(async function (): Promise<void> {
    blockchainDeploy = createBlockchainDeploy({ hre });
    await blockchainDeploy.deployContractsByTags({
      tags: [testGroupName],
    });
    attackerSolutionContract = (await blockchainDeploy.getDeployedContract({
      contractName: attackerContractName,
    })) as AttackerContractType;
  });
  /**
   * Purpose: Non user-facing test. Ensures the solution is working correctly.
   * ContractNames.AttackerSolutionPattern0 will try to exploit ContractNames.Vulnerable
   */
  // eslint-disable-next-line mocha/no-setup-in-describe
  challengeEnv.getAutomationEnvDescribe({
    fn() {
      it(
        tutorialConfigConst.ChallengeDescriptions.shouldNotCauseARevertOperation,
        async function (): Promise<void> {
          await errorTest.useAttackWithoutRevert({
            attacker: attackerSolutionContract,
            shouldWork: true,
          });
        },
      );
      it(
        tutorialConfigConst.ChallengeDescriptions
          .shouldBeAbleToStealAllEthFromVulnerableContract,
        async function (): Promise<void> {
          await ethTest.useAttackToDrainAllFunds({
            attacker: attackerSolutionContract,
            attackerContractName,
            challengeParser,
            deployer: blockchainDeploy,
            shouldWork: true,
            vulnerableContractName,
          });
        },
      );
    },
    testGroupName,
  });
});
