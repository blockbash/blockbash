// SPDX-License-Identifier: MIT
// WARNING: This is buggy code. Do NOT use in the real world.

pragma solidity 0.8.24;

import "./shared/VulnerableBase.sol";

contract VulnerableSolutionPattern1 is VulnerableBase {
  mapping(address => uint256) public balances;

  constructor() payable VulnerableBase() {}

  // Allow a customer the ability to deposit funds into their account
  function deposit() public payable {
    uint256 initialBalance = balances[msg.sender];
    balances[msg.sender] += msg.value;
    emit AttackerDepositBalance(
      initialBalance / 1 ether,
      balances[msg.sender] / 1 ether
    );
    emit VulnerableContractBalance(address(this).balance / 1 ether);
  }

  // Allow a customer the ability to withdraw all ETH from their account.
  function withdrawAll() public {
    uint256 beginExecutionBalance = balances[msg.sender];
    // COMMENT GROUP A: START
    if (beginExecutionBalance <= 0) {
      revert("Customer has insufficient balance");
    }
    bool success = payable(msg.sender).send(beginExecutionBalance);
    require(success, "Failed to send ETH");
    balances[msg.sender] = 0;
    // COMMENT GROUP A: END
  }
}
