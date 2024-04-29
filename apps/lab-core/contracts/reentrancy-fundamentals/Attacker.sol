// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "./shared/AttackerBase.sol";
import "./shared/EventsBase.sol";

contract Attacker is AttackerBase, EventsBase {
  // IMPORTANT: ONLY CHANGE THE FUNCTIONS THAT HAVE BEEN OUTLINED IN THE INSTRUCTIONS
  uint256 private constant _ATTACK_AMOUNT = 1 ether;


  constructor(
    address _vulnerableContractAddress
  ) public payable AttackerBase(_vulnerableContractAddress) {}

  // Function is executed when VulnerableContract sends eth.
  receive() external payable override {
    // Helpful for debugging
    emit AttackerContractBalance(address(this).balance / 1 ether);

    // TIP: You can call methods on the vulnerableContract
    // E.g., `vulnerableContract.withdrawAll()`

    // INSERT LOGIC HERE: START
    // LOGIC...
    // INSERT LOGIC HERE: END
  }

  function attack() external override {
    // Helpful for debugging
    emit AttackerContractBalance(address(this).balance / 1 ether);

    // TIP: You can call methods on the vulnerableContract
    // E.g., `vulnerableContract.withdrawAll()`

    // INSERT LOGIC HERE: START
    // LOGIC...
    // INSERT LOGIC HERE: END

    // Helpful for debugging
    emit AttackerContractBalance(address(this).balance / 1 ether);
    emit VulnerableContractBalance(address(vulnerableContract).balance / 1 ether);
  }
}
