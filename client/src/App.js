import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: "",newValue:"", web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {

      this.handleOnchange = this.handleOnchange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleOnchange(e){
    this.setState({newValue:e.target.value})

  }
  async handleSubmit(e){
    e.preventDefault()
    const { accounts, contract } = this.state;
    await contract.methods.set(this.state.newValue).send({ from: accounts[0] });
    const response = await contract.methods.get().call();
    console.log('response',response)
    this.setState({storageValue:response})
  }

  runExample = async () => {
    const {  contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set("").send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();
    console.log('response',response)
    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>FABLO GOOD STUFF!</h1>

        <div>The stored value is: {this.state.storageValue}</div>
      <form onSubmit={this.handleSubmit}>
        <input type="text" value={this.state.newvalue} onChange={this.handleOnchange}/>
      <input type="submit" value="Submit"/>
      </form>

      </div>
    );
  }
}

export default App;
