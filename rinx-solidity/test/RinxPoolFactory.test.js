// placeholder - in progress
require("dotenv").config();
const { expectRevert } = require("@openzeppelin/test-helpers");
const RinxPoolFactory = artifacts.require("RinxPoolFactory");

contract("RinxPoolFactory", (accounts) => {
  web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
  
  const verifierAddr = web3.eth.accounts.wallet[0].address;

  let instance;
  
  before(async () => {
    instance = await RinxPoolFactory.deployed();
  });
  
  it("should deploy", async () => {
    assert.isFalse(!(instance), "missing truthy instance");
  });

});
