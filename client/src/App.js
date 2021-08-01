import React, { Component } from "react";
import MyToken from  "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component { 

  state = { loaded : false, 
        KycAddress : "0x123....",
        tokenSaleAddress : 0, 
        userTokens : null,
      };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
     
      this.MyToken = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
      );

      this.MyTokenSale = new this.web3.eth.Contract( 
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
      );

      this.KycContract = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
      );

      this.state.tokenSaleAddress = MyTokenSale.networks[this.networkId].address;

     // this.duraken = await this.web3.eth.getBalance(0xFac574445ED5aDfbE31def69a931B08860518dAC);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.lisntenToTokenTransfer();
      this.setState({ loaded : true, }, this.updateUserTokens );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInputChange= (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name] : value,
    });
  }

  handleKycWhitlisting = async () => {
    await this.KycContract.methods.setKycCompleted(this.state.KycAddress).send({from : this.accounts[0]});
    alert("Kyc for "+ this.state.KycAddress +" is completed")
  }

  updateUserTokens = async () => {
    let userTokens = await this.MyToken.methods.balanceOf(this.accounts[0]).call();
    this.setState({userTokens : userTokens});
  }

  lisntenToTokenTransfer = () => {
    this.MyToken.events.Transfer({to:this.accounts[0]}).on("data", this.updateUserTokens);
  }

  handleBuyToken = async () => {
    await this.MyTokenSale.methods.buyTokens(this.accounts[0]).send({from:this.accounts[0],value: this.web3.utils.toWei("1", "ether")}); 
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>StarDucks Cappuchino Soken Sell</h1>
        <p>Get Your Token Today!</p>
        <h2>Kyc Whitelisting</h2>
        Address to allow: <input type="text" name="KycAddress" value={this.state.KycAddress} onChange={this.handleInputChange} />
        <button type="button" onClick={this.handleKycWhitlisting} >Add to whitelist</button>
        <h2>Buy Token Sale</h2>
        <p>If you want buy tokens, send wei to this address : {this.state.tokenSaleAddress}</p>
        <p>You currently have : {this.state.userTokens} Cappu Token</p>
        <button type="button" onClick={this.handleBuyToken}>Buy More Token</button>
      </div>
    );
  }
}
//0xFac574445ED5aDfbE31def69a931B08860518dAC
export default App;
