import {
  type ReentrancyFundamentalsDependencies
} from "./reentrancyFundaments.types"

export class ReentrancyFundamentals {
  protected blockchainDeploy: ReentrancyFundamentalsDependencies["blockchainDeploy"]

  protected logger: ReentrancyFundamentalsDependencies["logger"]

  protected tutorialConfig: ReentrancyFundamentalsDependencies["tutorialConfig"]

  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: ReentrancyFundamentalsDependencies
  })
  {
    this.logger = injectedDependencies.logger
    this.tutorialConfig = injectedDependencies.tutorialConfig
    this.blockchainDeploy = injectedDependencies.blockchainDeploy
  }
}
