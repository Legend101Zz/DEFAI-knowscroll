import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ChannelNFT", function () {
  let channelNFT: Contract;
  let owner: SignerWithAddress;
  let creator: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  const baseURI = "https://ipfs.io/ipfs/";

  beforeEach(async function () {
    // Get signers
    [owner, creator, user1, user2] = await ethers.getSigners();

    // Deploy ChannelNFT contract
    const ChannelNFT = await ethers.getContractFactory("ChannelNFT");
    channelNFT = await ChannelNFT.deploy(baseURI);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await channelNFT.owner()).to.equal(owner.address);
    });

    it("Should set the base URI correctly", async function () {
      const exampleChannelId = 1;
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

      const channelId = 1; // First channel should have ID 1
      const channel = await channelNFT.getChannel(channelId);

      expect(channel.name).to.equal(channelName);
      expect(channel.description).to.equal(channelDescription);
      expect(channel.category).to.equal(channelCategory);
      expect(channel.creator).to.equal(creator.address);
      expect(channel.totalShares).to.equal(initialShares);
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

      const channelId = 1; // First channel should have ID 1
      const creatorBalance = await channelNFT.balanceOf(
        creator.address,
        channelId
      );

      expect(creatorBalance).to.equal(initialShares);
    });

    it("Should reject channel creation with zero shares", async function () {
      await expect(
        channelNFT
          .connect(creator)
          .createChannel("Test Channel", "Test Description", "Education", 0)
      ).to.be.revertedWith("ChannelNFT: initial shares must be greater than 0");
    });

    it("Should reject channel creation with empty name", async function () {
      await expect(
        channelNFT
          .connect(creator)
          .createChannel("", "Test Description", "Education", 100)
      ).to.be.revertedWith("ChannelNFT: name cannot be empty");
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
      const channelId = 1;

      await channelNFT.connect(creator).setChannelActive(channelId, false);

      const channel = await channelNFT.getChannel(channelId);
      expect(channel.active).to.equal(false);
    });

    it("Should prevent non-creator from setting channel inactive", async function () {
      const channelId = 1;

      await expect(
        channelNFT.connect(user1).setChannelActive(channelId, false)
      ).to.be.revertedWith("ChannelNFT: not creator or owner");
    });

    it("Should allow owner to set channel inactive", async function () {
      const channelId = 1;

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
      const channelId = 1;
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

      expect(creatorBalance).to.equal(100 - transferAmount);
      expect(user1Balance).to.equal(transferAmount);
    });

    it("Should allow batch transfer of shares", async function () {
      const channelId = 1;
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
      const secondChannelId = 2;

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

      expect(creatorBalanceChannel1).to.equal(100 - transferAmount);
      expect(user1BalanceChannel1).to.equal(transferAmount);

      expect(creatorBalanceChannel2).to.equal(100 - transferAmount);
      expect(user1BalanceChannel2).to.equal(transferAmount);
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
      expect(Number(creatorChannels[0])).to.equal(1);
      expect(Number(creatorChannels[1])).to.equal(2);

      expect(user1Channels.length).to.equal(1);
      expect(Number(user1Channels[0])).to.equal(3);
    });

    it("Should return the correct total channels count", async function () {
      const totalChannels = await channelNFT.getTotalChannels();
      expect(totalChannels).to.equal(3);
    });
  });
});
