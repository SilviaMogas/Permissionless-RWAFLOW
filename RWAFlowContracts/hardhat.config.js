require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.24",
  networks: {
    flow: {
      url: 'https://mainnet.evm.nodes.onflow.org',
      accounts: process.env.DEPLOY_WALLET_1 ? [process.env.DEPLOY_WALLET_1] : [],
      chainId: 747,
    },
    flowTestnet: {
      url: 'https://testnet.evm.nodes.onflow.org',
      accounts: process.env.DEPLOY_WALLET_1 ? [process.env.DEPLOY_WALLET_1] : [],
      chainId: 545,
    },
  },
  etherscan: {
    apiKey: {
      flowTestnet: "any-string", // Flow doesn't require a real API key
      flow: "any-string",
    },
    customChains: [
      {
        network: "flowTestnet",
        chainId: 545,
        urls: {
          apiURL: "https://evm-testnet.flowscan.io/api",
          browserURL: "https://evm-testnet.flowscan.io/",
        },
      },
      {
        network: "flow",
        chainId: 747,
        urls: {
          apiURL: "https://evm.flowscan.io/api",
          browserURL: "https://evm.flowscan.io/",
        },
      },
    ],
  },
};