import type { BaseContract } from "ethers";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import type {
  DeployOptions,
  DeployResult,
  Deployment,
} from "hardhat-deploy/types";

import {
  TutorialsConfigOrchestrator,
  type tutorialConfigTypes,
} from "@blockbash/common";

import type { BlockchainDeployDependencies } from "./blockchain.types";

export class BlockchainDeploy {
  private readonly bigNumberLib: BlockchainDeployDependencies["bigNumberLib"];
  private readonly ethLib: BlockchainDeployDependencies["ethLib"];
  private readonly hre: HardhatRuntimeEnvironment;
  private readonly logger: BlockchainDeployDependencies["logger"];

  constructor({
    hre,
    injectedDependencies,
  }: {
    hre: HardhatRuntimeEnvironment;
    injectedDependencies: BlockchainDeployDependencies;
  }) {
    this.hre = hre;
    this.ethLib = injectedDependencies.ethLib;
    this.logger = injectedDependencies.logger;
    this.bigNumberLib = injectedDependencies.bigNumberLib;
    this.logger.setGlobalContext({
      className: BlockchainDeploy.name,
      logicPath: __filename,
    });
  }

  /**
   * Deploys contracts onto local blockchain.
   * @param tags - Corresponds to tags that are defined within lab-core/deploy/.  If tags === [], all deploy scripts will be executed.
   * @private
   */
  private async deployContracts({
    tags,
  }: {
    tags?: tutorialConfigTypes.ChallengeGroupGUIDs;
  }): Promise<Record<string, Deployment>> {
    const deployment = this.hre.deployments.fixture(tags, {
      fallbackToGlobal: false,
      keepExistingDeployments: false,
    });
    this.logger.logInnerFinishedExecution({
      functionName: this.deployContracts.name,
      metadata: {
        deployment,
        tags,
      },
    });
    return await deployment;
  }

  async deploy({
    constructorArgs = [],
    contract,
  }: {
    constructorArgs?: any[];
    contract: tutorialConfigTypes.Contract;
  }): Promise<DeployResult[]> {
    const commonOptions: DeployOptions = {
      autoMine: true,
      from: await this.getAccountAddress({
        accountGUID: contract.deployAccountGUID,
      }),
      log: true,
      value: this.bigNumberLib.from(
        this.ethLib.ethToWei({ eth: contract.ethAmount }),
      ),
    };

    const contractNames = TutorialsConfigOrchestrator.getContractNames({
      contract,
    });
    const deployments: DeployResult[] = [];
    for (const contractName of contractNames) {
      if (contract.proxy) {
        this.logger.debug({
          functionName: this.deploy.name,
          message: "Deploying proxy contract",
          metadata: {
            commonOptions,
            constructorArgs,
            contractName,
          },
        });
        deployments.push(
          await this.hre.deployments.deploy(contractName, {
            ...commonOptions,
            proxy: {
              execute: {
                args: constructorArgs,
                methodName: "initialize",
              },
              proxyContract: "OpenZeppelinTransparentProxy",
            },
          }),
        );
      } else {
        this.logger.debug({
          functionName: this.deploy.name,
          message: "Deploying non-proxy contract",
          metadata: {
            commonOptions,
            constructorArgs,
            contractName,
          },
        });
        deployments.push(
          await this.hre.deployments.deploy(contractName, {
            ...commonOptions,
            args: constructorArgs,
          }),
        );
      }
    }
    this.logger.logInnerFinishedExecution({
      functionName: this.deploy.name,
      metadata: {
        deployments,
      },
    });
    return deployments;
  }

  async deployAllContracts(): Promise<Record<string, Deployment>> {
    return await this.deployContracts({});
  }

  async deployContractsByTags({
    tags,
  }: {
    tags: tutorialConfigTypes.ChallengeGroupGUIDs;
  }): Promise<Record<string, Deployment>> {
    // Each deployment function within lab/deploy will declare a
    // tags property.  This property is leveraged within the deploy process
    // (e.g., this.hre.deployments.fixture)

    // Turn off tracer during the initial deploy event
    this.hre.tracer.enabled = false;
    const deployment = await this.deployContracts({ tags });
    this.hre.tracer.enabled = true;
    return deployment;
  }

  async getAccountAddress({
    accountGUID,
  }: {
    accountGUID: tutorialConfigTypes.ContractDeployAccountGUID;
  }): Promise<string> {
    const namedAccounts = await this.hre.getNamedAccounts();
    const accountAddress = namedAccounts[accountGUID];
    if (typeof accountAddress === "undefined") {
      const message = "Account not defined";
      this.logger.error({
        functionName: this.getAccountAddress.name,
        message,
        metadata: {
          accountAddress,
          accountGUID,
          namedAccounts,
        },
      });
      throw new Error(message);
    }
    return accountAddress;
  }

  async getContracts(
    contractNames: tutorialConfigTypes.ContractNames,
  ): Promise<Array<Awaited<BaseContract>>> {
    const contracts = contractNames.map(
      async (contractName: tutorialConfigTypes.ContractName) =>
        await this.getDeployedContract({ contractName }),
    );
    if (contracts.length === 0) {
      const message = "No contracts found";
      this.logger.error({
        functionName: this.getContracts.name,
        message,
      });
      throw new Error(message);
    }
    return await Promise.all(contracts);
  }

  async getDeployedContract({
    contractName,
  }: {
    contractName: tutorialConfigTypes.ContractName;
  }): Promise<BaseContract> {
    return await this.hre.ethers.getContract(contractName);
  }

  async getWeiBalance({
    contractName,
  }: {
    contractName: tutorialConfigTypes.ContractName;
  }): Promise<bigint> {
    const deployedContract = await this.getDeployedContract({ contractName });
    return await this.hre.ethers.provider.getBalance(
      deployedContract.getAddress(),
    );
  }
}
