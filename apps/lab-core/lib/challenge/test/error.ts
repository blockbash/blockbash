import { type Attacker, type AttackerSolution } from "@typechain";
import { expect } from "chai";
import hre from "hardhat";
import "mocha";

async function useAttackWithoutRevert({
  attacker,
  shouldWork,
}: {
  attacker: Attacker | AttackerSolution;
  shouldWork: boolean;
}): Promise<void> {
  // Tracer should be enabled for only one test (i.e., "primary" test)
  hre.tracer.enabled = false;
  const tx = await attacker.attack();
  hre.tracer.enabled = false;

  if (shouldWork) {
    await expect(tx).not.to.be.reverted;
  } else {
    await expect(tx).to.be.reverted;
  }
}

export { useAttackWithoutRevert };
