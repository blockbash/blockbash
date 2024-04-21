// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "./shared/AttackerBase.sol";
import "./shared/EventsBase.sol";

contract Attacker is AttackerBase, EventsBase {
  // IMPORTANT: ONLY CHANGE THE FUNCTIONS THAT HAVE BEEN OUTLINED IN THE INSTRUCTIONS

  constructor(
    address _vulnerableContractAddress
  ) public payable AttackerBase(_vulnerableContractAddress) {}

  // Function is executed when VulnerableContract sends eth.
  receive() external payable override {
    // Helpful for debugging
    emit AttackerContractBalance(address(this).balance / 1 ether);

    // You can call methods on the vulnerableContract here
    // E.g., `vulnerableContract.withdrawAll()`
    // TODO: INSERT RECEIVE LOGIC HERE
  }

  function attack() external override {
    // You can call methods on the vulnerableContract here
    // E.g., `vulnerableContract.withdrawAll()`
    // TODO: INSERT ATTACK LOGIC HERE

    // Helpful for debugging
    emit AttackerContractBalance(address(this).balance / 1 ether);
  }
}
