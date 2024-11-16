import {
  type blockchainTypes,
  challengeParser,
  createBlockchainDeploy,
  tutorialConfigConst,
} from "@blockbash/common-be";
import { type Attacker } from "@typechain";
import hre from "hardhat";
import { challengeEnv, errorTest, ethTest } from "lib/challenge";
import "mocha";
/* Configuration Values */
const testGroupName =
  tutorialConfigConst.ChallengeGroupGUID.reentrancyFundamentalsAttackPrompt;
const attackerContractName = tutorialConfigConst.ContractName.Attacker;
type AttackerContractType = Attacker;
const vulnerableContractName = tutorialConfigConst.ContractName.Vulnerable;

/* Setup Logic that applies to all test envs */
describe(testGroupName, function (): void {
  let blockchainDeploy: blockchainTypes.BlockchainDeploy;
  let attackerContract: Attacker;

  beforeEach(async function (): Promise<void> {
    blockchainDeploy = createBlockchainDeploy({ hre });
    await blockchainDeploy.deployContractsByTags({
      tags: [testGroupName],
    });
    attackerContract = (await blockchainDeploy.getDeployedContract({
      contractName: attackerContractName,
    })) as AttackerContractType;
    await blockchainDeploy.getDeployedContract({
      contractName: vulnerableContractName,
    });
  });

  /**
   * User-facing test. The user will update ContractNames.Attacker.
   * ContractNames.Attacker will try to exploit ContractNames.Vulnerable
   */
  // eslint-disable-next-line mocha/no-setup-in-describe
  challengeEnv.getUserEnvDescribe({
    fn() {
      it(
        tutorialConfigConst.ChallengeDescriptions
          .shouldNotCauseARevertOperation,
        async function (): Promise<void> {
          await errorTest.useAttackWithoutRevert({
            attacker: attackerContract,
            shouldWork: true,
          });
        },
      );
      it(
        tutorialConfigConst.ChallengeDescriptions
          .shouldBeAbleToStealAllEthFromVulnerableContract,
        async function (): Promise<void> {
          await ethTest.useAttackToDrainAllFunds({
            attacker: attackerContract,
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

  // Verify the user-facing prompt isn't automatically solvable
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
