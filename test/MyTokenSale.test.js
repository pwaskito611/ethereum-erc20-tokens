const token = artifacts.require("MyToken");
const TokenSale = artifacts.require("MyTokenSale");
const KycContract = artifacts.require("KycContract");


const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({path: "../.env"});

contract("TokenSale Test", async (accounts) => {

    const [deployerAccount, recipient, anotherAccount] = accounts;

    it("it should not have any token in my deployeder account", async() => {
        let instance = await token.deployed();
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
    })

    it("all token should be in TokenSale smart contract by default", async() => {
        let instance = await token.deployed();
        let balanceOfTokenSmartContract = await instance.balanceOf(TokenSale.address);
        let totalSupply = await instance.totalSupply();
        return expect(balanceOfTokenSmartContract).to.be.a.bignumber.equal(totalSupply);
    })

    it("should be possible to buy token", async() => {
        let tokenInstance = await token.deployed();
        let tokenSaleInstace = await TokenSale.deployed();
        let KycInstace = await KycContract.deployed();

        await KycInstace.setKycCompleted(deployerAccount, {from: deployerAccount});
        let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
        expect( tokenSaleInstace.sendTransaction({from : deployerAccount, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled;        
        console.log(await tokenInstance.balanceOf(deployerAccount));//avoid truffle bug in linux and mac os
        
        balanceBefore = balanceBefore.add(new BN(1));
        return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceBefore);
    })
})