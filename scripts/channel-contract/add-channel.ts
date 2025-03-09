import { ethers } from "hardhat";
import { ChannelNFT } from "../../typechain-types";

async function main() {
  // Get signer
  const [deployer] = await ethers.getSigners();
  console.log("Interacting with contract using account:", deployer.address);

  // Connect to the deployed ChannelNFT contract
  const channelNFTAddress = "0x9c6DA895C8f2006beDEF3E9A99555280CA91b532";
  const channelNFT = (await ethers.getContractAt(
    "ChannelNFT",
    channelNFTAddress
  )) as unknown as ChannelNFT;

  console.log("Connected to ChannelNFT at:", await channelNFT.getAddress());

  // Define channels to create
  const channels = [
    {
      name: "History Highlights",
      description: "Quick facts and important milestones from world history",
      category: "History",
      initialShares: 100,
    },
    {
      name: "Physics in 60 Seconds",
      description: "Bite-sized explanations of complex physics concepts",
      category: "Science",
      initialShares: 150,
    },
    {
      name: "Coding Concepts",
      description: "Programming principles and patterns explained simply",
      category: "Technology",
      initialShares: 120,
    },
    {
      name: "Future Tech",
      description: "Emerging technologies that will shape our tomorrow",
      category: "Technology",
      initialShares: 200,
    },
    {
      name: "Philosophy Fragments",
      description: "Brief insights into major philosophical ideas",
      category: "Philosophy",
      initialShares: 80,
    },
  ];

  // Create channels one by one
  for (const channel of channels) {
    console.log(`Creating channel: ${channel.name}...`);

    const tx = await channelNFT.createChannel(
      channel.name,
      channel.description,
      channel.category,
      channel.initialShares
    );

    // Wait for transaction to be mined
    const receipt = await tx.wait();
    console.log(
      `Channel "${channel.name}" created! Transaction hash:`,
      receipt?.hash
    );
  }

  // Get total number of channels
  const totalChannels = await channelNFT.getTotalChannels();
  console.log("Total Channels:", totalChannels.toString());

  // Get all channels created by the deployer
  const createdChannels = await channelNFT.getCreatedChannels(deployer.address);
  console.log(
    "Channels created by you:",
    createdChannels.map((id) => id.toString())
  );

  // Get details for each channel
  console.log("\nChannel Details:");
  for (const channelId of createdChannels) {
    const channel = await channelNFT.getChannel(channelId);
    console.log(`Channel #${channelId}:`, {
      name: channel.name,
      description: channel.description,
      category: channel.category,
      totalShares: channel.totalShares.toString(),
      active: channel.active,
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
