import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
  networks: {
    sonic: {
      url: process.env.SONIC_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    sonicTestnet: {
      url: process.env.SONIC_TESTNET_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  etherscan: {
    apiKey: {
      sonic: process.env.SONICSCAN_API_KEY || "YOUR_SONICSCAN_API_KEY",
      sonicTestnet:
        process.env.SONICSCAN_TESTNET_API_KEY || "YOUR_SONICSCAN_API_KEY",
    },
    customChains: [
      {
        network: "sonic",
        chainId: 146,
        urls: {
          apiURL: "https://api.sonicscan.org/api",
          browserURL: "https://sonicscan.org",
        },
      },
      {
        network: "sonicTestnet",
        chainId: 57054,
        urls: {
          apiURL: "https://api-testnet.sonicscan.org/api",
          browserURL: "https://testnet.sonicscan.org",
        },
      },
    ],
  },
};

export default config;
