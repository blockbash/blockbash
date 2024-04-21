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

class ReentrancyFundamentalsAttackPrompt extends ReentrancyFundamentals {
  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: reentrancyFundamentalsTypes.ReentrancyFundamentalsDependencies
  }) {
    super({ injectedDependencies })
    this.logger.setGlobalContext({
      className: ReentrancyFundamentalsAttackPrompt.name,
      logicPath: __filename,
    })
  }

  async deploy(): Promise<void> {
    const vulnerableContractConfig = this.tutorialConfig.getContract({
      contractName: tutorialConfigConst.ContractName.Vulnerable,
      tutorialGUID:
        tutorialConfigConst.TutorialGUID.reentrancyFundamentalsAttackPrompt,
    })
    await this.blockchainDeploy.deploy({
      contract: vulnerableContractConfig,
    })
    const deployedVulnerableContract =
      (await this.blockchainDeploy.getDeployedContract({
        contractName: vulnerableContractConfig.name,
      })) as Vulnerable

    const attackerContractConfig = this.tutorialConfig.getContract({
      contractName: tutorialConfigConst.ContractName.Attacker,
      tutorialGUID:
        tutorialConfigConst.TutorialGUID.reentrancyFundamentalsAttackPrompt,
    })
    await this.blockchainDeploy.deploy({
      constructorArgs: [
        await deployedVulnerableContract.getAddress(),
      ] as Parameters<AttackerFactory["deploy"]>,
      contract: attackerContractConfig,
    })
  }
}

const createReentrancyFundamentalsAttackPrompt: DeployFunction = async (
  hre: HardhatRuntimeEnvironment,
) => {
  await new ReentrancyFundamentalsAttackPrompt({
    injectedDependencies: {
      blockchainDeploy: createBlockchainDeploy({ hre }),
      logger: createLogger(),
      tutorialConfig,
    },
  }).deploy()
}

export default createReentrancyFundamentalsAttackPrompt
createReentrancyFundamentalsAttackPrompt.tags = [
  tutorialConfigConst.TutorialGUID.reentrancyFundamentalsAttackPrompt,
]
// ;(async () => {
//   await createReentrancyFundamentalsAttackPrompt(hre)
//   await deployments.fixture([
//     tutorialConfigConst.TutorialNames.reentrancy_fundamentals_attack_prompt,
//   ])
// console.log(await deployments.all())
// })()
