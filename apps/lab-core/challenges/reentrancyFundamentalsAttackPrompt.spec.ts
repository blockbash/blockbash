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
const challengeGroupName =
  tutorialConfigConst.TutorialName.reentrancyFundamentalsAttackPrompt;

// The user will update ContractNames.Attack
// ContractNames.Attacker will try to exploit ContractNames.Vulnerable
describe(challengeGroupName, function (): void {
  let blockchainDeploy: blockchainTypes.BlockchainDeploy;
  let attackerContract: Attacker;

  beforeEach(async function (): Promise<void> {
    blockchainDeploy = createBlockchainDeploy({ hre });
    await blockchainDeploy.deployContractsByTags({
      tags: [
        tutorialConfigConst.TutorialGUID.reentrancyFundamentalsAttackPrompt,
      ],
    });
    attackerContract = (await blockchainDeploy.getDeployedContract({
      contractName: tutorialConfigConst.ContractName.Attacker,
    })) as Attacker;
    await blockchainDeploy.getDeployedContract({
      contractName: tutorialConfigConst.ContractName.Vulnerable,
    });
  });

  // eslint-disable-next-line mocha/no-setup-in-describe
  challengeEnv.getUserEnvDescribe({
    challengeGroupName,
    fn() {
      it(
        tutorialConfigConst.AttackDescriptions.useAttackWithoutRevert,
        async function (): Promise<void> {
          await errorTest.useAttackWithoutRevert({
            attacker: attackerContract,
            shouldWork: true,
          });
        },
      );
      it(
        tutorialConfigConst.AttackDescriptions.useAttackToSuccessfullyDrainFunds,
        async function (): Promise<void> {
          await ethTest.useAttackToDrainAllFunds({
            attacker: attackerContract,
            attackerContractName: tutorialConfigConst.ContractName.Attacker,
            challengeParser,
            deployer: blockchainDeploy,
            shouldWork: true,
            vulnerableContractName: tutorialConfigConst.ContractName.Vulnerable,
          });
        },
      );
    },
    testSummary:
      // eslint-disable-next-line mocha/no-setup-in-describe
      tutorialConfigConst.AttackDescriptions.useAttackToSuccessfullyDrainFunds,
  });

  // eslint-disable-next-line mocha/no-setup-in-describe
  challengeEnv.getAutomationEnvDescribe({
    challengeGroupName,
    fn() {
      it(
        tutorialConfigConst.AttackDescriptions.useAttackWithRevert,
        async function (): Promise<void> {
          await errorTest.useAttackWithoutRevert({
            attacker: attackerContract,
            shouldWork: false,
          });
        },
      );
      it(
        tutorialConfigConst.AttackDescriptions.useAttackToUnsuccessfullyDrainFunds,
        async function (): Promise<void> {
          await ethTest.useAttackToDrainAllFunds({
            attacker: attackerContract,
            attackerContractName: tutorialConfigConst.ContractName.Attacker,
            challengeParser,
            deployer: blockchainDeploy,
            shouldWork: false,
            vulnerableContractName: tutorialConfigConst.ContractName.Vulnerable,
          });
        },
      );
    },
    testSummary:
      // eslint-disable-next-line mocha/no-setup-in-describe
      tutorialConfigConst.AttackDescriptions.useAttackToSuccessfullyDrainFunds,
  });
});
