const path = require("path");
require("dotenv").config({path:"./.env"});
const HDWalletProvider = require("@truffle/hdwallet-provider");
const accountIndex = 0 ;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      port: 7545,
      host: "127.0.0.1",
      network_id: 5777
    },
    ganache_local : {
      provider : function () {
        return new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:7545", accountIndex)
      },
      network_id : 5777
    },
    ropsten_network : {
      provider : function () {
        return new HDWalletProvider(process.env.MNEMONIC, "wss://ropsten.infura.io/ws/v3/e2c89ad654b84de4a8681cc96d30a01b", accountIndex)
      },
      network_id : 3// if use http?
    },
    gorli_network : {
      provider : function () {
        return new HDWalletProvider(process.env.MNEMONIC, "https://goerli.infura.io/v3/e2c89ad654b84de4a8681cc96d30a01b", accountIndex)
      },
      network_id : 5
    },
    
  },
  compilers : {
    solc : {
      version : "0.6.2"
    }
  }
};
/*
Error: PollingBlockTracker - encountered an error while attempting to update latest block:
Error: ETIMEDOUT
    at Timeout.<anonymous> (/home/pandu/Belajar/lasttt/node_modules/request/request.js:848:19)
    at listOnTimeout (internal/timers.js:554:17)
    at processTimers (internal/timers.js:497:7)
    at PollingBlockTracker._performSync (/home/pandu/Belajar/lasttt/node_modules/eth-block-tracker/src/polling.js:51:24)
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
*/
