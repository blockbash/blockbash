import {
  type blockchainTypes,
  type challengeParserTypes,
  type tutorialConfigConst,
} from "@blockbash/common-be";
import { type Attacker, type AttackerSolution } from "@typechain";
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
  attacker: Attacker | AttackerSolution;
  attackerContractName: tutorialConfigConst.ContractName;
  challengeParser: challengeParserTypes.ChallengeParser;
  deployer: blockchainTypes.BlockchainDeploy;
  shouldWork: boolean;
  vulnerableContractName: tutorialConfigConst.ContractName;
}): Promise<void> {
  hre.tracer.enabled = true;
  await attacker.attack();
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
