// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

contract EventsBase {
  event CustomerBalance(uint256 previousEthBalance, uint256 currentEthBalance);
  event AttackerContractBalance(uint256 currentEthBalance);
  event VulnerableContractBalance(uint256 currentEthBalance);
}
