import {
  type blockchainTypes,
  challengeParser,
  createBlockchainDeploy,
  tutorialConfigConst,
} from "@blockbash/common-be"
import { type AttackerSolution } from "@typechain"
import hre from "hardhat"
import { challengeEnv, reentrancyFundamentals } from "lib/challenge"
import "mocha"

const challengeGroupName =
  tutorialConfigConst.TutorialName.reentrancyFundamentalsAttackSolution

// Internal Only
// ContractNames.AttackerSolution will try to exploit ContractNames.Vulnerable
describe(challengeGroupName, function () {
  let attackerSolutionContract: AttackerSolution
  let blockchainDeploy: blockchainTypes.BlockchainDeploy

  beforeEach(async function () {
    blockchainDeploy = createBlockchainDeploy({ hre })
    await blockchainDeploy.deployContractsByTags({
      tags: [
        tutorialConfigConst.TutorialGUID.reentrancyFundamentalsAttackSolution,
      ],
    })

    attackerSolutionContract = (await blockchainDeploy.getDeployedContract({
      contractName: tutorialConfigConst.ContractName.AttackerSolution,
    })) as AttackerSolution
  })

  // eslint-disable-next-line mocha/no-setup-in-describe
  challengeEnv.getAutomationEnvDescribe({
    challengeGroupName,
    fn() {
      it(
        reentrancyFundamentals.SharedDescriptions
          .useAttackToSuccessfullyDrainFunds,
        async function () {
          await reentrancyFundamentals.useAttackToDrainAllFunds({
            attacker: attackerSolutionContract,
            attackerContractName:
              tutorialConfigConst.ContractName.AttackerSolution,
            challengeParser,
            deployer: blockchainDeploy,
            shouldWork: true,
            vulnerableContractName: tutorialConfigConst.ContractName.Vulnerable,
          })
        },
      )
    },
    testSummary:
      // eslint-disable-next-line mocha/no-setup-in-describe
      reentrancyFundamentals.SharedDescriptions
        .useAttackToSuccessfullyDrainFunds,
  })
})
