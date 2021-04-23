// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RinxPool {
  uint public prize;
  address public factory;
  address public owner;
  mapping(address => uint) public wagers;

  event PrizeIncreased(uint indexed prize);
  event RinxPoolClosed(uint indexed poolAmt);

  constructor(address _owner) payable {
    require(_owner != address(0), "RinxPool: invalid _owner");
    factory = msg.sender;
    owner = _owner;
  }

  function placeWager() external payable {
    require(msg.value > 0, "RinxPool: no value provided");
    prize += msg.value;
    wagers[msg.sender] += msg.value;
    emit PrizeIncreased(prize);
  }

  function closePool() external {
    require(msg.sender == owner, "RinxPool: must be owner");
    emit RinxPoolClosed(address(this).balance);
    selfdestruct(payable(owner));
  }
}
