// placeholder - in progress
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./RinxPool.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RinxPoolFactory is Ownable {
  struct RinxPoolDetails {
    address owner;
    address addr;
  }
  
  uint public rinxCreationFees;
  address[] public rinxs;
  mapping(address => RinxPoolDetails) public rinxOwners;
  
  event RinxPoolFactoryInitialized(address indexed addr);
  event RinxPoolOpened(address indexed owner, address indexed addr);

  constructor() {
    emit RinxPoolFactoryInitialized(address(this));
  }
  
  function createPool(address _owner) external payable returns(address addrPool) {
    require(msg.value > rinxCreationFees, "RinxFactory: Not enough value provided");
    uint rinxReward = msg.value - rinxCreationFees;
    addrPool = address(new RinxPool(_owner));
    rinxs.push(addrPool);
    rinxOwners[addrPool] = RinxPoolDetails({ owner: msg.sender, addr: addrPool });
    emit RinxPoolOpened(msg.sender, addrPool);
  }
  
  function destroyPool(RinxPool _pool) external payable {
    uint balanceBefore = address(this).balance;
    address poolOwner = _pool.owner();
    _pool.closePool();
    require(address(this).balance >= balanceBefore, "RinxPoolFactory: balance issue");
    
    (bool _success, ) = poolOwner.call{ value: address(this).balance - balanceBefore, gas: gasleft() }("");
    require(_success, "RinxPoolFactory: low-level call failed");
  }
}
