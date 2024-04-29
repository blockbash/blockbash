enum AttackDescriptions {
  "useAttackToSuccessfullyDrainFunds" = "should be able to use attack() to drain all eth from VulnerableContract",
  "useAttackToUnsuccessfullyDrainFunds" = "should NOT be able to use attack() to drain all eth from VulnerableContract",
  "useAttackWithRevert" = "should be able to use attack() and cause a revert",
  "useAttackWithoutRevert" = "should be able to use attack() and not cause a revert",
}

export { AttackDescriptions };
