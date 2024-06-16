import {
  type blockchainTypes,
  challengeParser,
  createBlockchainDeploy,
  tutorialConfigConst,
} from "@blockbash/common-be";
import { type AttackerSolution } from "@typechain";
import hre from "hardhat";
import { challengeEnv, ethTest } from "lib/challenge";
import "mocha";
const challengeGroupName =
  tutorialConfigConst.TutorialName.reentrancyFundamentalsDefendSolution;

// Internal Only
// ContractNames.AttackerSolution will try to exploit ContractNames.VulnerableSolution
describe(challengeGroupName, function (): void {
  let blockchainDeploy: blockchainTypes.BlockchainDeploy;
  let attackerSolutionContract: AttackerSolution;

  beforeEach(async function (): Promise<void> {
    blockchainDeploy = createBlockchainDeploy({ hre });
    await blockchainDeploy.deployContractsByTags({
      tags: [
        tutorialConfigConst.TutorialGUID.reentrancyFundamentalsDefendSolution,
      ],
    });
    attackerSolutionContract = (await blockchainDeploy.getDeployedContract({
      contractName: tutorialConfigConst.ContractName.AttackerSolution,
    })) as AttackerSolution;
  });

  // eslint-disable-next-line mocha/no-setup-in-describe
  challengeEnv.getAutomationEnvDescribe({
    challengeGroupName,
    fn() {
      it(
        tutorialConfigConst.AttackDescriptions
          .useAttackToUnsuccessfullyDrainFunds,
        async function (): Promise<void> {
          await ethTest.useAttackToDrainAllFunds({
            attacker: attackerSolutionContract,
            attackerContractName:
              tutorialConfigConst.ContractName.AttackerSolution,
            challengeParser,
            deployer: blockchainDeploy,
            shouldWork: false,
            vulnerableContractName:
              tutorialConfigConst.ContractName.VulnerableSolution,
          });
        },
      );
    },
    testSummary:
      // eslint-disable-next-line mocha/no-setup-in-describe
      tutorialConfigConst.AttackDescriptions
        .useAttackToUnsuccessfullyDrainFunds,
  });
});
