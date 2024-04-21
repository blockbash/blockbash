// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

interface IVulnerableContract {
  function deposit() external payable;

  function withdrawAll() external;
}

contract AttackerBase {
  IVulnerableContract public vulnerableContract;

  constructor(address _vulnerableContractAddress) public payable {
    vulnerableContract = IVulnerableContract(_vulnerableContractAddress);
  }

  // Function is executed when VulnerableContract sends eth.
  receive() external payable virtual {}

  function attack() external virtual {}
}
