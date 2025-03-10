import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  // Get required parameters from environment variables or use defaults
  const channelNFTAddress = process.env.CHANNEL_NFT_ADDRESS;
  if (!channelNFTAddress) {
    throw new Error("CHANNEL_NFT_ADDRESS environment variable not set");
  }

  const quorumThreshold = process.env.QUORUM_THRESHOLD
    ? parseInt(process.env.QUORUM_THRESHOLD)
    : 2000; // Default: 20%

  const minVotingPeriod = process.env.MIN_VOTING_PERIOD
    ? parseInt(process.env.MIN_VOTING_PERIOD)
    : 3600; // Default: 1 hour

  console.log("Deploying ContentApproval with parameters:");
  console.log(`  ChannelNFT Address: ${channelNFTAddress}`);
  console.log(
    `  Quorum Threshold: ${quorumThreshold} (${quorumThreshold / 100}%)`
  );
  console.log(`  Min Voting Period: ${minVotingPeriod} seconds`);

  // Deploy ContentApproval contract
  const ContentApproval = await ethers.getContractFactory("ContentApproval");
  const contentApproval = await ContentApproval.deploy(
    channelNFTAddress,
    quorumThreshold,
    minVotingPeriod
  );

  await contentApproval.waitForDeployment();
  const deployedAddress = await contentApproval.getAddress();
  console.log(`ContentApproval deployed to: ${deployedAddress}`);

  // Skip the waitForTransaction call that's causing the error

  // Print verification commands for both testnet and mainnet
  console.log("\nTo verify on Sonic Blaze Testnet Explorer:");
  console.log(
    `npx hardhat verify --network sonicTestnet ${deployedAddress} ${channelNFTAddress} ${quorumThreshold} ${minVotingPeriod}`
  );

  console.log("\nTo verify on Sonic Mainnet Explorer:");
  console.log(
    `npx hardhat verify --network sonic ${deployedAddress} ${channelNFTAddress} ${quorumThreshold} ${minVotingPeriod}`
  );
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
