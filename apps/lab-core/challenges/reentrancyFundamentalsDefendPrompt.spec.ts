import {
  type blockchainTypes,
  challengeParser,
  createBlockchainDeploy,
  tutorialConfigConst,
} from "@blockbash/common-be";
import { type AttackerSolution } from "@typechain";
import hre from "hardhat";
import { challengeEnv, ethTest, testConst } from "lib/challenge";
import "mocha";

const challengeGroupName =
  tutorialConfigConst.TutorialName.reentrancyFundamentalsDefendPrompt;
// TODO: What occurs if leaner adds revert statement to solution?

// The user will update ContractNames.Vulnerable
// ContractNames.AttackerSolution will try to exploit ContractNames.Vulnerable
describe(challengeGroupName, function (): void {
  let blockchainDeploy: blockchainTypes.BlockchainDeploy;
  let attackerSolutionContract: AttackerSolution;

  beforeEach(async function (): Promise<void> {
    blockchainDeploy = createBlockchainDeploy({ hre });
    await blockchainDeploy.deployContractsByTags({
      tags: [
        tutorialConfigConst.TutorialGUID.reentrancyFundamentalsDefendPrompt,
      ],
    });

    attackerSolutionContract = (await blockchainDeploy.getDeployedContract({
      contractName: tutorialConfigConst.ContractName.AttackerSolution,
    })) as AttackerSolution;
  });

  // eslint-disable-next-line mocha/no-setup-in-describe
  challengeEnv.getUserEnvDescribe({
    challengeGroupName,
    fn() {
      it(
        testConst.AttackDescriptions.useAttackToUnsuccessfullyDrainFunds,
        async function (): Promise<void> {
          await ethTest.useAttackToDrainAllFunds({
            attacker: attackerSolutionContract,
            attackerContractName:
              tutorialConfigConst.ContractName.AttackerSolution,
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
      testConst.AttackDescriptions.useAttackToUnsuccessfullyDrainFunds,
  });
});
