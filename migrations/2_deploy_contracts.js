var MyToken = artifacts.require("./MyToken.sol");
var MyTokenSale = artifacts.require("./MyTokenSale");
var MYKycContract = artifacts.require("./KycContract");
require("dotenv").config({path: "../.env"});

module.exports = async function(deployer) {
  let addr = await web3.eth.getAccounts();
  await deployer.deploy(MyToken, process.env.INITIAL_TOKENS);
  await deployer.deploy(MYKycContract);
  await deployer.deploy(MyTokenSale, 1, addr[0], MyToken.address, MYKycContract.address);
  let instance = await MyToken.deployed();
  await instance.transfer(MyTokenSale.address, process.env.INITIAL_TOKENS)

};
