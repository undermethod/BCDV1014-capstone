const RinxPool = artifacts.require("RinxPool");
const RinxPoolFactory = artifacts.require("RinxPoolFactory");

module.exports = (deployer, network, accounts) => {
  deployer.deploy(RinxPool, accounts[0]);
  deployer.deploy(RinxPoolFactory);
}
