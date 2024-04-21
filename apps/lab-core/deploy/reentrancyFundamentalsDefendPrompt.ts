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
  type Vulnerable,
} from "@typechain"
import { type HardhatRuntimeEnvironment } from "hardhat/types"
import { type DeployFunction } from "hardhat-deploy/types"

class ReentrancyFundamentalsDefendPrompt extends ReentrancyFundamentals {
  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: reentrancyFundamentalsTypes.ReentrancyFundamentalsDependencies
  }) {
    super({ injectedDependencies })
  }

  async deploy(): Promise<void> {
    await this.blockchainDeploy.deploy({
      contract: this.tutorialConfig.getContract({
        contractName: tutorialConfigConst.ContractName.Vulnerable,
        tutorialGUID:
          tutorialConfigConst.TutorialGUID.reentrancyFundamentalsDefendPrompt,
      }),
    })
    const vulnerableContract = (await this.blockchainDeploy.getDeployedContract(
      {
        contractName: tutorialConfigConst.ContractName.Vulnerable,
      },
    )) as Vulnerable

    await this.blockchainDeploy.deploy({
      constructorArgs: [await vulnerableContract.getAddress()] as Parameters<
        AttackerFactory["deploy"]
      >,
      contract: this.tutorialConfig.getContract({
        contractName: tutorialConfigConst.ContractName.AttackerSolution,
        tutorialGUID:
          tutorialConfigConst.TutorialGUID.reentrancyFundamentalsDefendPrompt,
      }),
    })
  }
}

const createReentrancyFundamentalsDefendPrompt: DeployFunction = async (
  hre: HardhatRuntimeEnvironment,
): Promise<void> => {
  await new ReentrancyFundamentalsDefendPrompt({
    injectedDependencies: {
      blockchainDeploy: createBlockchainDeploy({ hre }),
      logger: createLogger(),
      tutorialConfig,
    },
  }).deploy()
}

export default createReentrancyFundamentalsDefendPrompt
createReentrancyFundamentalsDefendPrompt.tags = [
  tutorialConfigConst.TutorialGUID.reentrancyFundamentalsDefendPrompt,
]
// ;(async () => {
//   await createReentrancyFundamentalsAttackPrompt(hre)
//   await deployments.fixture([
//     tutorialConfigConst.TutorialNames.reentrancy_fundamentals_attack_prompt,
//   ])
// console.log(await deployments.all())
// })()
