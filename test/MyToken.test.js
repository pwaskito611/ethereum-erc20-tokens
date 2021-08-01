const token = artifacts.require("MyToken");

const chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({path: "../.env"});


contract("Token Test", async (accounts) => {

    const [deployerAccount, recipient, anotherAccount] = accounts;

    beforeEach(async() => {
        this.myToken = await token.new( process.env.INITIAL_TOKENS);
    })

    it("all token should be in my account", async () => {
        //let instance = await token.deployed();
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        
        //let balance = await instance.balanceOf(accounts[0]);
        //assert.equal(balance.valueOf(), initialSupply.valueOf(), "The balance was not same");
         return expect(await instance.balanceOf(deployerAccount)).to.be.a.bignumber.equal(totalSupply);
    });

    it("it is possible to send token between account", async () => {
        const sendTokens = 1;
        //let instance = await token.deployed();
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        expect(instance.transfer(recipient, sendTokens)).to.eventually.be.a.fulfilled;
        
        console.log(await instance.balanceOf(deployerAccount));
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    });

    it("it is not possibli to send more token than avaible in total", async () => {
        //let instance = await token.deployed();
        let instance = this.myToken;
        let balanceOfDeployer = await instance.balanceOf(deployerAccount);

        expect(instance.transfer(recipient, new BN(balanceOfDeployer+1))).to.eventually.be.rejected;
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
    });
})