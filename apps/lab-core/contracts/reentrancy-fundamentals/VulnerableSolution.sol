// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "./shared/VulnerableBase.sol";
import "./shared/EventsBase.sol";

contract VulnerableSolution is VulnerableBase, EventsBase {
  constructor() payable VulnerableBase() {}

  // Allow a customer the ability to deposit funds into their account
  function deposit() public payable {
    uint256 initialBalance = balances[msg.sender];
    balances[msg.sender] += msg.value;
    emit CustomerBalance(
      initialBalance / 1 ether,
      balances[msg.sender] / 1 ether
    );
    emit VulnerableContractBalance(address(this).balance / 1 ether);
  }

  // Allow a customer the ability to withdraw all eth from their account.
  function withdrawAll() public {
    if (balances[msg.sender] <= 0) {
      revert("Customer has insufficient balance");
    }
    uint256 initialBalance = balances[msg.sender]; // FIX
    balances[msg.sender] = 0; // FIX
    msg.sender.call{value: initialBalance}("");
    // balances[primarySpinnerText.sender] = 0; // FIX
    emit VulnerableContractBalance(address(this).balance / 1 ether);
  }
}
