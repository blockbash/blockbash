import {
  type blockchainTypes,
  type challengeParserTypes,
  type tutorialConfigConst,
} from "@blockbash/common-be";
import { type Attacker, type AttackerSolutionPattern0 } from "@typechain";
import { expect } from "chai";
import hre from "hardhat";
import "mocha";

async function useAttackToDrainAllFunds({
  attacker,
  attackerContractName,
  challengeParser,
  deployer,
  shouldWork,
  vulnerableContractName,
}: {
  attacker: Attacker | AttackerSolutionPattern0;
  attackerContractName: tutorialConfigConst.ContractName;
  challengeParser: challengeParserTypes.ChallengeParser;
  deployer: blockchainTypes.BlockchainDeploy;
  shouldWork: boolean;
  vulnerableContractName: tutorialConfigConst.ContractName;
}): Promise<void> {
  hre.tracer.enabled = true;
  try {
    // At this point in the execution flow, the contract has been
    // successfully deployed.
    // An error will be thrown if attacker.attack() creates a revert operation or there is a coding error.
    // This will cause the test to fail.  Depending on the test, this might not be ideal.  As such, we swallow the error.
    // If expect() tests the END STATE, this error swallowing shouldn't matter.
    await attacker.attack();
  } catch (e) {}
  hre.tracer.enabled = false;

  const attackerBalance = await deployer.getWeiBalance({
    contractName: attackerContractName,
  });
  const vulnerableBalance = await deployer.getWeiBalance({
    contractName: vulnerableContractName,
  });
  const totalBalance = attackerBalance + vulnerableBalance;

  const contexts = [
    `${attackerContractName} Contract Balance: ${attackerBalance}`,
    `${vulnerableContractName} Contract Balance: ${vulnerableBalance}`,
  ];

  if (shouldWork) {
    expect(
      attackerBalance,
      `${challengeParser.createChallengeContexts({
        contexts,
      })}`,
    ).to.eq(totalBalance);
  } else {
    expect(
      attackerBalance,
      `${challengeParser.createChallengeContexts({ contexts })}`,
    ).to.not.eq(totalBalance);
  }
}

export { useAttackToDrainAllFunds };
