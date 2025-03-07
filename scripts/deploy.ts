import { ethers } from "hardhat";

async function main(): Promise<void> {
  console.log("Starting deployment...");

  // Get the deployer's address
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy ChannelNFT
  console.log("Deploying ChannelNFT contract...");
  // Use IPFS gateway as base URI
  const baseURI: string = "https://ipfs.io/ipfs/";
  const ChannelNFTFactory = await ethers.getContractFactory("ChannelNFT");
  const channelNFT = await ChannelNFTFactory.deploy(baseURI);
  await channelNFT.waitForDeployment();
  const channelNFTAddress: string = await channelNFT.getAddress();
  console.log("ChannelNFT deployed to:", channelNFTAddress);

  // Deploy RevenueDistribution
  console.log("Deploying RevenueDistribution contract...");
  const platformFeePercentage: number = 500; // 5%
  const RevenueDistributionFactory = await ethers.getContractFactory(
    "RevenueDistribution"
  );
  const revenueDistribution = await RevenueDistributionFactory.deploy(
    channelNFTAddress,
    platformFeePercentage,
    deployer.address // Platform fee recipient
  );
  await revenueDistribution.waitForDeployment();
  const revenueDistributionAddress: string =
    await revenueDistribution.getAddress();
  console.log("RevenueDistribution deployed to:", revenueDistributionAddress);

  // Deploy Marketplace
  console.log("Deploying Marketplace contract...");
  const marketplaceFeePercentage: number = 250; // 2.5%
  const MarketplaceFactory = await ethers.getContractFactory("Marketplace");
  const marketplace = await MarketplaceFactory.deploy(
    channelNFTAddress,
    marketplaceFeePercentage,
    deployer.address // Fee recipient
  );
  await marketplace.waitForDeployment();
  const marketplaceAddress: string = await marketplace.getAddress();
  console.log("Marketplace deployed to:", marketplaceAddress);

  // Deploy Governance
  console.log("Deploying Governance contract...");
  const proposalThreshold: number = 500; // 5%
  const minVotingPeriod: number = 86400; // 1 day in seconds
  const GovernanceFactory = await ethers.getContractFactory("Governance");
  const governance = await GovernanceFactory.deploy(
    channelNFTAddress,
    proposalThreshold,
    minVotingPeriod
  );
  await governance.waitForDeployment();
  const governanceAddress: string = await governance.getAddress();
  console.log("Governance deployed to:", governanceAddress);

  console.log("Deployment completed!");

  // Print all contract addresses for easy reference
  console.log("\nContract addresses:");
  console.log("--------------------");
  console.log("ChannelNFT:", channelNFTAddress);
  console.log("RevenueDistribution:", revenueDistributionAddress);
  console.log("Marketplace:", marketplaceAddress);
  console.log("Governance:", governanceAddress);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });

sourcify: {
  enabled: true;
}

/*
Deployment completed!

Contract addresses:
--------------------
ChannelNFT: 0x9c6DA895C8f2006beDEF3E9A99555280CA91b532
RevenueDistribution: 0xBC2D811eFFEF3066C433811d27806f1A2F8e3Be8
Marketplace: 0x7fF79A30cc7A03d3BB3f11d623AEE15798a7Efd6
Governance: 0x8a47f1097F85fa4f8ce536d513744Fb4377FBc72
*/
