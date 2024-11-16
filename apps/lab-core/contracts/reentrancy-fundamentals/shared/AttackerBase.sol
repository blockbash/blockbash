// SPDX-License-Identifier: MIT
// WARNING: This is buggy code. Do NOT use in the real world.

pragma solidity 0.8.24;

interface IVulnerableContract {
  function deposit() external payable;

  function balances(address i) external returns (uint256);

  function withdrawAll() external;
}

contract AttackerBase {
  IVulnerableContract public vulnerableContract;
  // If there is a same event in Attacker and Vulnerable contracts, hardhat-tracer can
  // get confused.  By convention, we add _ postfix to all Attacker events to ensure they are different.
  event AttackerContractBalance_(uint256 currentEthBalance);
  event VulnerableContractBalance_(uint256 currentEthBalance);
  event AttackerDepositBalance_(uint256 currentEthBalance);

  constructor(address _vulnerableContractAddress) public payable {
    vulnerableContract = IVulnerableContract(_vulnerableContractAddress);
  }

  // Function is executed when VulnerableContract sends ETH.
  receive() external payable virtual {}

  function attack() external virtual {}
}
