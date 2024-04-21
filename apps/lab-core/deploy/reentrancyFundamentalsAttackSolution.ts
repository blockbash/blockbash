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
// eslint-disable-next-line camelcase
import {
  type Attacker__factory as AttackerFactory,
  type Vulnerable,
} from "@typechain"
import { type HardhatRuntimeEnvironment } from "hardhat/types"
import { type DeployFunction } from "hardhat-deploy/types"

// Internal Only: Leveraged to challenges actual solution
// ContractNames.AttackerSolution will try to exploit ContractNames.Vulnerable
class ReentrancyFundamentalsAttackSolution extends ReentrancyFundamentals {
  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: reentrancyFundamentalsTypes.ReentrancyFundamentalsDependencies
  }) {
    super({ injectedDependencies })
    this.logger.setGlobalContext({
      className: ReentrancyFundamentalsAttackSolution.name,
      logicPath: __filename,
    })
  }

  async deploy(): Promise<void> {
    await this.blockchainDeploy.deploy({
      contract: this.tutorialConfig.getContract({
        contractName: tutorialConfigConst.ContractName.Vulnerable,
        tutorialGUID:
          tutorialConfigConst.TutorialGUID.reentrancyFundamentalsAttackSolution,
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
          tutorialConfigConst.TutorialGUID.reentrancyFundamentalsAttackSolution,
      }),
    })
  }
}

const createReentrancyFundamentalsAttackSolution: DeployFunction = async (
  hre: HardhatRuntimeEnvironment,
): Promise<void> => {
  await new ReentrancyFundamentalsAttackSolution({
    injectedDependencies: {
      blockchainDeploy: createBlockchainDeploy({ hre }),
      logger: createLogger(),
      tutorialConfig,
    },
  }).deploy()
}

export default createReentrancyFundamentalsAttackSolution
createReentrancyFundamentalsAttackSolution.tags = [
  tutorialConfigConst.TutorialGUID.reentrancyFundamentalsAttackSolution,
]

// ;(async () => {
//   await func(hre)
//   // await deployments.fixture([TUTORIAL_NAMESPACE])
//   console.log(await deployments.all())
// })()
