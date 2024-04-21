import {
  createBlockchainDeploy,
  createLogger,
  tutorialConfig,
  tutorialConfigConst,
} from "@blockbash/common-be"
import {
  ReentrancyFundamentals,
  type reentrancyFundamentalsTypes,
} from "@lib/deploy"
import {
  type Attacker__factory as AttackerFactory,
  type VulnerableSolution,
} from "@typechain"
import { type HardhatRuntimeEnvironment } from "hardhat/types"
import { type DeployFunction } from "hardhat-deploy/types"

class ReentrancyFundamentalsDefendSolution extends ReentrancyFundamentals {
  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: reentrancyFundamentalsTypes.ReentrancyFundamentalsDependencies
  }) {
    super({ injectedDependencies })
  }

  // Internal Only
  // ContractNames.AttackerSolution will try to exploit ContractNames.VulnerableSolution
  async deploy(): Promise<void> {
    await this.blockchainDeploy.deploy({
      contract: this.tutorialConfig.getContract({
        contractName: tutorialConfigConst.ContractName.VulnerableSolution,
        tutorialGUID:
          tutorialConfigConst.TutorialGUID.reentrancyFundamentalsDefendSolution,
      }),
    })
    const vulnerableContractSolution =
      (await this.blockchainDeploy.getDeployedContract({
        contractName: tutorialConfigConst.ContractName.VulnerableSolution,
      })) as VulnerableSolution

    await this.blockchainDeploy.deploy({
      constructorArgs: [
        await vulnerableContractSolution.getAddress(),
      ] as Parameters<AttackerFactory["deploy"]>,
      contract: this.tutorialConfig.getContract({
        contractName: tutorialConfigConst.ContractName.AttackerSolution,
        tutorialGUID:
          tutorialConfigConst.TutorialGUID.reentrancyFundamentalsDefendSolution,
      }),
    })
  }
}

const createReentrancyFundamentalsDefendSolution: DeployFunction = async (
  hre: HardhatRuntimeEnvironment,
): Promise<void> => {
  await new ReentrancyFundamentalsDefendSolution({
    injectedDependencies: {
      blockchainDeploy: createBlockchainDeploy({ hre }),
      logger: createLogger(),
      tutorialConfig,
    },
  }).deploy()
}
export default createReentrancyFundamentalsDefendSolution
createReentrancyFundamentalsDefendSolution.tags = [
  tutorialConfigConst.TutorialGUID.reentrancyFundamentalsDefendSolution,
]
// ;(async () => {
//   await createReentrancyFundamentalsAttackPrompt(hre)
//   await deployments.fixture([
//     tutorialConfigConst.TutorialNames.reentrancy_fundamentals_attack_prompt,
//   ])
// console.log(await deployments.all())
// })()
