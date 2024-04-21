import { type EthDependencies } from "./eth.types"

export class Eth {
  private readonly ethLib: EthDependencies["ethLib"]

  private readonly logger: EthDependencies["logger"]

  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: EthDependencies
  }) {
    this.logger = injectedDependencies.logger.setGlobalContext({
      className: Eth.name,
      logicPath: __filename,
    })
    this.ethLib = injectedDependencies.ethLib
  }

  ethToWei({ eth }: { eth: number }) {
    const wei = this.ethLib.parseEther(eth.toString())
    this.logger.debug({
      functionName: this.ethToWei.name,
      message: `Converted eth into wei`,
      metadata: { eth, wei: Number(wei) },
    })
    return wei
  }
}
