import { type tutorialConfigTypes } from "@blockbash/common-be";
/*
 * Typechain types: The differences between the contracts (e.g., Vulnerable/VulnerableSolutionPattern0) are NOT structural.  All of the differences are within various methods.  Thus, for simplicity, use the 'Vulnerable' type for the 'VulnerableSolutionPattern0' contract.
 * */
import {
  type Attacker__factory as AttackerFactory,
  type Vulnerable,
} from "@typechain";

import { type ReentrancyFundamentalsDependencies } from "./reentrancyFundaments.types";

export class ReentrancyFundamentals {
  protected blockchainDeploy: ReentrancyFundamentalsDependencies["blockchainDeploy"];

  protected logger: ReentrancyFundamentalsDependencies["logger"];
  protected tutorialConfig: ReentrancyFundamentalsDependencies["tutorialConfig"];

  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: ReentrancyFundamentalsDependencies;
  }) {
    this.logger = injectedDependencies.logger;
    this.tutorialConfig = injectedDependencies.tutorialConfig;
    this.blockchainDeploy = injectedDependencies.blockchainDeploy;
    this.logger.setGlobalContext({
      className: ReentrancyFundamentals.name,
      logicPath: __filename,
    });
  }

  async deploy({
    attackerContractName,
    challengeGroupGUID,
    tutorialGUID,
    vulnerableContractName,
  }: {
    attackerContractName: tutorialConfigTypes.ContractName;
    challengeGroupGUID: tutorialConfigTypes.ChallengeGroupGUID;
    tutorialGUID: tutorialConfigTypes.TutorialGUID;
    vulnerableContractName: tutorialConfigTypes.ContractName;
  }): Promise<void> {
    this.logger.info({
      functionName: this.deploy.name,
      message: "Starting deploy process",
      metadata: {
        attackerContractName,
        challengeGroupGUID,
        tutorialGUID,
        vulnerableContractName,
      },
    });
    const vulnerableContractConfig = this.tutorialConfig.getContract({
      contractName: vulnerableContractName,
      tutorialGUID,
    });
    await this.blockchainDeploy.deploy({
      contract: vulnerableContractConfig,
    });
    const deployedVulnerableContract =
      (await this.blockchainDeploy.getDeployedContract({
        contractName: vulnerableContractConfig.name,
      })) as Vulnerable;

    const attackerContractConfig = this.tutorialConfig.getContract({
      contractName: attackerContractName,
      tutorialGUID,
    });
    await this.blockchainDeploy.deploy({
      constructorArgs: [
        await deployedVulnerableContract.getAddress(),
      ] as Parameters<AttackerFactory["deploy"]>,
      contract: attackerContractConfig,
    });
  }
}
