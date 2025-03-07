import { expect } from "chai";
import { ethers } from "hardhat";
import { ChannelNFT } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("ChannelNFT", function () {
  let channelNFT: ChannelNFT;
  let owner: HardhatEthersSigner;
  let creator: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;

  const baseURI = "https://ipfs.io/ipfs/";

  beforeEach(async function () {
    // Get signers
    [owner, creator, user1, user2] = await ethers.getSigners();

    // Deploy ChannelNFT contract
    const ChannelNFTFactory = await ethers.getContractFactory("ChannelNFT");
    channelNFT = (await ChannelNFTFactory.deploy(
      baseURI
    )) as unknown as ChannelNFT;
    await channelNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await channelNFT.owner()).to.equal(owner.address);
    });

    it("Should set the base URI correctly", async function () {
      const exampleChannelId = 1n;
      await channelNFT
        .connect(creator)
        .createChannel("Test Channel", "Test Description", "Education", 100);

      // URI should include baseURI + tokenId
      expect(await channelNFT.uri(exampleChannelId)).to.equal(
        baseURI + exampleChannelId.toString()
      );
    });
  });

  describe("Channel Creation", function () {
    it("Should create a channel with correct properties", async function () {
      const channelName = "Test Channel";
      const channelDescription = "Test Description";
      const channelCategory = "Education";
      const initialShares = 100;

      await channelNFT
        .connect(creator)
        .createChannel(
          channelName,
          channelDescription,
          channelCategory,
          initialShares
        );

      const channelId = 1n; // First channel should have ID 1
      const channel = await channelNFT.getChannel(channelId);

      expect(channel.name).to.equal(channelName);
      expect(channel.description).to.equal(channelDescription);
      expect(channel.category).to.equal(channelCategory);
      expect(channel.creator).to.equal(creator.address);
      expect(channel.totalShares).to.equal(BigInt(initialShares));
      expect(channel.active).to.equal(true);
    });

    it("Should mint initial shares to the creator", async function () {
      const initialShares = 100;

      await channelNFT
        .connect(creator)
        .createChannel(
          "Test Channel",
          "Test Description",
          "Education",
          initialShares
        );

      const channelId = 1n; // First channel should have ID 1
      const creatorBalance = await channelNFT.balanceOf(
        creator.address,
        channelId
      );

      expect(creatorBalance).to.equal(BigInt(initialShares));
    });

    it("Should reject channel creation with zero shares", async function () {
      // Using a simpler assertion that doesn't rely on custom error support
      await expect(
        channelNFT
          .connect(creator)
          .createChannel("Test Channel", "Test Description", "Education", 0)
      ).to.be.reverted;
    });

    it("Should reject channel creation with empty name", async function () {
      await expect(
        channelNFT
          .connect(creator)
          .createChannel("", "Test Description", "Education", 100)
      ).to.be.reverted;
    });
  });

  describe("Channel Management", function () {
    beforeEach(async function () {
      // Create a test channel
      await channelNFT
        .connect(creator)
        .createChannel("Test Channel", "Test Description", "Education", 100);
    });

    it("Should allow creator to set channel as inactive", async function () {
      const channelId = 1n;

      await channelNFT.connect(creator).setChannelActive(channelId, false);

      const channel = await channelNFT.getChannel(channelId);
      expect(channel.active).to.equal(false);
    });

    it("Should prevent non-creator from setting channel inactive", async function () {
      const channelId = 1n;

      await expect(channelNFT.connect(user1).setChannelActive(channelId, false))
        .to.be.reverted;
    });

    it("Should allow owner to set channel inactive", async function () {
      const channelId = 1n;

      await channelNFT.connect(owner).setChannelActive(channelId, false);

      const channel = await channelNFT.getChannel(channelId);
      expect(channel.active).to.equal(false);
    });
  });

  describe("Share Transfers", function () {
    beforeEach(async function () {
      // Create a test channel
      await channelNFT
        .connect(creator)
        .createChannel("Test Channel", "Test Description", "Education", 100);
    });

    it("Should allow transfer of shares", async function () {
      const channelId = 1n;
      const transferAmount = 30;

      await channelNFT
        .connect(creator)
        .safeTransferFrom(
          creator.address,
          user1.address,
          channelId,
          transferAmount,
          "0x"
        );

      const creatorBalance = await channelNFT.balanceOf(
        creator.address,
        channelId
      );
      const user1Balance = await channelNFT.balanceOf(user1.address, channelId);

      expect(creatorBalance).to.equal(BigInt(100 - transferAmount));
      expect(user1Balance).to.equal(BigInt(transferAmount));
    });

    it("Should allow batch transfer of shares", async function () {
      const channelId = 1n;
      const transferAmount = 30;

      // Creator creates another channel
      await channelNFT
        .connect(creator)
        .createChannel(
          "Second Channel",
          "Another Description",
          "Entertainment",
          100
        );
      const secondChannelId = 2n;

      await channelNFT
        .connect(creator)
        .safeBatchTransferFrom(
          creator.address,
          user1.address,
          [channelId, secondChannelId],
          [transferAmount, transferAmount],
          "0x"
        );

      const creatorBalanceChannel1 = await channelNFT.balanceOf(
        creator.address,
        channelId
      );
      const user1BalanceChannel1 = await channelNFT.balanceOf(
        user1.address,
        channelId
      );

      const creatorBalanceChannel2 = await channelNFT.balanceOf(
        creator.address,
        secondChannelId
      );
      const user1BalanceChannel2 = await channelNFT.balanceOf(
        user1.address,
        secondChannelId
      );

      expect(creatorBalanceChannel1).to.equal(BigInt(100 - transferAmount));
      expect(user1BalanceChannel1).to.equal(BigInt(transferAmount));

      expect(creatorBalanceChannel2).to.equal(BigInt(100 - transferAmount));
      expect(user1BalanceChannel2).to.equal(BigInt(transferAmount));
    });
  });

  describe("Channel Queries", function () {
    beforeEach(async function () {
      // Create multiple test channels
      await channelNFT
        .connect(creator)
        .createChannel("Channel 1", "Description 1", "Education", 100);
      await channelNFT
        .connect(creator)
        .createChannel("Channel 2", "Description 2", "Entertainment", 200);
      await channelNFT
        .connect(user1)
        .createChannel("Channel 3", "Description 3", "Gaming", 150);
    });

    it("Should return correct created channels for an address", async function () {
      const creatorChannels = await channelNFT.getCreatedChannels(
        creator.address
      );
      const user1Channels = await channelNFT.getCreatedChannels(user1.address);

      expect(creatorChannels.length).to.equal(2);
      expect(creatorChannels[0]).to.equal(1n);
      expect(creatorChannels[1]).to.equal(2n);

      expect(user1Channels.length).to.equal(1);
      expect(user1Channels[0]).to.equal(3n);
    });

    it("Should return the correct total channels count", async function () {
      const totalChannels = await channelNFT.getTotalChannels();
      expect(totalChannels).to.equal(3n);
    });
  });
});
