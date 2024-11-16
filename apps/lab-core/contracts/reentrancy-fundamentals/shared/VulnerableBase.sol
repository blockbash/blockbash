// SPDX-License-Identifier: MIT
// WARNING: This is buggy code. Do NOT use in the real world.

pragma solidity 0.8.24;

contract VulnerableBase {
  constructor() payable {}
  event AttackerDepositBalance(
    uint256 previousEthBalance,
    uint256 currentEthBalance
  );
  event VulnerableContractBalance(uint256 currentEthBalance);
}
