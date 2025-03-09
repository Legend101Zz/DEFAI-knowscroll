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

  // Create a new channel
  const channelName = "Introduction to AI";
  const channelDescription =
    "Learn the basics of artificial intelligence and machine learning";
  const channelCategory = "Technology";
  const initialShares = 100;

  console.log(`Creating channel: ${channelName}...`);

  const tx = await channelNFT.createChannel(
    channelName,
    channelDescription,
    channelCategory,
    initialShares
  );

  // Wait for transaction to be mined
  const receipt = await tx.wait();
  console.log("Channel created! Transaction hash:", receipt?.hash);

  // Get the channel ID from the event
  // Note: This assumes the event is properly indexed and can be parsed
  const channelCreatedEvent = receipt?.logs.find(
    (log) =>
      log.topics[0] ===
      channelNFT.interface.getEvent("ChannelCreated").topicHash
  );

  if (channelCreatedEvent) {
    // Parse the event to get the channel ID
    const parsedEvent = channelNFT.interface.parseLog({
      topics: channelCreatedEvent.topics as string[],
      data: channelCreatedEvent.data,
    });

    if (parsedEvent && parsedEvent.args) {
      const channelId = parsedEvent.args[0];
      console.log("New Channel ID:", channelId.toString());

      // Get channel details
      const channel = await channelNFT.getChannel(channelId);
      console.log("Channel Details:", {
        name: channel.name,
        description: channel.description,
        category: channel.category,
        creator: channel.creator,
        totalShares: channel.totalShares.toString(),
        createdAt: new Date(Number(channel.createdAt) * 1000).toLocaleString(),
        active: channel.active,
      });
    }
  }

  // Get total number of channels
  const totalChannels = await channelNFT.getTotalChannels();
  console.log("Total Channels:", totalChannels.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
