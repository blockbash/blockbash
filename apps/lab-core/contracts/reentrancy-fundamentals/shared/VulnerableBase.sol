// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

contract VulnerableBase {
  mapping(address => uint256) public balances;

  constructor() payable {}
}
