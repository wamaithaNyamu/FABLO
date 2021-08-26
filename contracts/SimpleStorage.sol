// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
  string public storedData;
  constructor(string memory x) public {
      storedData = x;
  }
  function set(string memory x) public {
    storedData = x;
  }

  function get() public view returns (string memory) {
    return storedData;
  }
}
