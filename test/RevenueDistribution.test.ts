import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { parseEther } from "ethers";

// Import TypeChain generated types
import { ChannelNFT } from "../typechain-types/contracts/ChannelNFT.sol";
import { RevenueDistribution } from "../typechain-types/contracts/RevenueDistribution.sol";
import { MockERC20 } from "../typechain-types/contracts/MockERC20";

describe("RevenueDistribution", function () {
  let channelNFT: ChannelNFT;
  let revenueDistribution: RevenueDistribution;
  let mockERC20: MockERC20;
  let mockERC20_2: MockERC20; // Second token for multi-token tests
  let owner: HardhatEthersSigner;
  let creator: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let platformFeeRecipient: HardhatEthersSigner;

  const baseURI = "https://ipfs.io/ipfs/";
  const platformFeePercentage = 500; // 5%

  beforeEach(async function () {
    // Get signers
    [owner, creator, user1, user2, platformFeeRecipient] =
      await ethers.getSigners();

    // Deploy ChannelNFT contract
    const ChannelNFTFactory = await ethers.getContractFactory("ChannelNFT");
    channelNFT = (await ChannelNFTFactory.deploy(
      baseURI
    )) as unknown as ChannelNFT;
    await channelNFT.waitForDeployment();

    // Deploy RevenueDistribution contract
    const RevenueDistributionFactory = await ethers.getContractFactory(
      "contracts/RevenueDistribution.sol:RevenueDistribution"
    );
    revenueDistribution = (await RevenueDistributionFactory.deploy(
      await channelNFT.getAddress(),
      platformFeePercentage,
      platformFeeRecipient.address
    )) as unknown as RevenueDistribution;
    await revenueDistribution.waitForDeployment();

    // Deploy mock ERC20 tokens for testing token revenue
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    mockERC20 = (await MockERC20Factory.deploy(
      "Mock Token",
      "MTK",
      18
    )) as unknown as MockERC20;
    await mockERC20.waitForDeployment();

    mockERC20_2 = (await MockERC20Factory.deploy(
      "Second Token",
      "STK",
      18
    )) as unknown as MockERC20;
    await mockERC20_2.waitForDeployment();

    // Create a test channel
    await channelNFT
      .connect(creator)
      .createChannel("Test Channel", "Test Description", "Education", 100);

    // Transfer some shares to user1
    const channelId = 1n;
    await channelNFT
      .connect(creator)
      .safeTransferFrom(creator.address, user1.address, channelId, 30, "0x");
  });

  describe("Deployment", function () {
    it("Should set the correct parameters", async function () {
      expect(await revenueDistribution.channelNFT()).to.equal(
        await channelNFT.getAddress()
      );
      expect(await revenueDistribution.platformFeePercentage()).to.equal(
        platformFeePercentage
      );
      expect(await revenueDistribution.platformFeeRecipient()).to.equal(
        platformFeeRecipient.address
      );
    });

    it("Should reject invalid initialization parameters", async function () {
      const RevenueDistributionFactory = await ethers.getContractFactory(
        "contracts/RevenueDistribution.sol:RevenueDistribution"
      );

      // Zero address for channelNFT
      await expect(
        RevenueDistributionFactory.deploy(
          ethers.ZeroAddress,
          platformFeePercentage,
          platformFeeRecipient.address
        )
      ).to.be.reverted;

      // Zero address for fee recipient
      await expect(
        RevenueDistributionFactory.deploy(
          await channelNFT.getAddress(),
          platformFeePercentage,
          ethers.ZeroAddress
        )
      ).to.be.reverted;

      // Fee too high
      await expect(
        RevenueDistributionFactory.deploy(
          await channelNFT.getAddress(),
          6000, // 60%
          platformFeeRecipient.address
        )
      ).to.be.reverted;
    });
  });

  describe("Native Token Revenue", function () {
    const revenueAmount = parseEther("1"); // 1 ETH
    const channelId = 1n;

    it("Should distribute revenue correctly", async function () {
      // Add revenue to the channel
      await revenueDistribution
        .connect(user2)
        .addRevenue(channelId, { value: revenueAmount });

      // Calculate expected amounts
      const platformFee =
        (revenueAmount * BigInt(platformFeePercentage)) / 10000n;
      const channelAmount = revenueAmount - platformFee;

      // Creator has 70 shares, user1 has 30 shares
      const creatorShare = (channelAmount * 70n) / 100n;
      const user1Share = (channelAmount * 30n) / 100n;

      // Check channel revenue
      expect(await revenueDistribution.channelRevenue(channelId)).to.equal(
        channelAmount
      );

      // Check claimable revenue
      expect(
        await revenueDistribution.getClaimableRevenue(
          channelId,
          creator.address
        )
      ).to.equal(creatorShare);
      expect(
        await revenueDistribution.getClaimableRevenue(channelId, user1.address)
      ).to.equal(user1Share);

      // Check platform fee recipient received fee
      const initialBalance = await ethers.provider.getBalance(
        platformFeeRecipient.address
      );
      expect(
        await ethers.provider.getBalance(platformFeeRecipient.address)
      ).to.equal(initialBalance + platformFee);
    });

    it("Should allow users to claim their revenue", async function () {
      // Add revenue to the channel
      await revenueDistribution
        .connect(user2)
        .addRevenue(channelId, { value: revenueAmount });

      // Calculate expected amounts
      const platformFee =
        (revenueAmount * BigInt(platformFeePercentage)) / 10000n;
      const channelAmount = revenueAmount - platformFee;
      const creatorShare = (channelAmount * 70n) / 100n;

      // Get creator's initial balance
      const creatorInitialBalance = await ethers.provider.getBalance(
        creator.address
      );

      // Creator claims revenue
      const claimTx = await revenueDistribution
        .connect(creator)
        .claimRevenue(channelId);
      const receipt = await claimTx.wait();

      // Calculate gas used
      const gasUsed = receipt ? BigInt(receipt.gasUsed * receipt.gasPrice) : 0n;

      // Check creator's final balance
      const creatorFinalBalance = await ethers.provider.getBalance(
        creator.address
      );

      // Use closeTo for ethers v6
      const diff =
        creatorFinalBalance - (creatorInitialBalance + creatorShare - gasUsed);
      expect(diff < parseEther("0.001") && diff > parseEther("-0.001")).to.be
        .true;

      // Check claimed revenue is recorded
      expect(
        await revenueDistribution.claimedRevenue(channelId, creator.address)
      ).to.equal(creatorShare);

      // Creator tries to claim again - should have nothing to claim
      await expect(revenueDistribution.connect(creator).claimRevenue(channelId))
        .to.be.reverted;
    });

    it("Should reject claims from users with no shares", async function () {
      // Add revenue to the channel
      await revenueDistribution
        .connect(user2)
        .addRevenue(channelId, { value: revenueAmount });

      // User2 has no shares, should fail to claim
      await expect(revenueDistribution.connect(user2).claimRevenue(channelId))
        .to.be.reverted;
    });
  });

  describe("Token Revenue", function () {
    const tokenAmount = 1000n; // 1000 token units
    const channelId = 1n;

    beforeEach(async function () {
      // Mint tokens to user2 for testing
      await mockERC20.mint(user2.address, tokenAmount * 2n);
      await mockERC20_2.mint(user2.address, tokenAmount * 2n);

      // Approve tokens for the revenue distribution contract
      await mockERC20
        .connect(user2)
        .approve(await revenueDistribution.getAddress(), tokenAmount * 2n);
      await mockERC20_2
        .connect(user2)
        .approve(await revenueDistribution.getAddress(), tokenAmount * 2n);
    });

    it("Should track token revenue separately", async function () {
      // Add token revenue to the channel
      await revenueDistribution
        .connect(user2)
        .addTokenRevenue(channelId, await mockERC20.getAddress(), tokenAmount);

      // Calculate expected amounts
      const platformFee =
        (tokenAmount * BigInt(platformFeePercentage)) / 10000n;
      const channelAmount = tokenAmount - platformFee;

      // Check channel token revenue was updated correctly
      expect(
        await revenueDistribution.channelTokenRevenue(
          channelId,
          await mockERC20.getAddress()
        )
      ).to.equal(channelAmount);

      // ETH revenue should remain zero
      expect(await revenueDistribution.channelRevenue(channelId)).to.equal(0);
    });

    it("Should distribute token revenue correctly", async function () {
      // Add token revenue to the channel
      await revenueDistribution
        .connect(user2)
        .addTokenRevenue(channelId, await mockERC20.getAddress(), tokenAmount);

      // Calculate expected amounts
      const platformFee =
        (tokenAmount * BigInt(platformFeePercentage)) / 10000n;
      const channelAmount = tokenAmount - platformFee;

      // Creator has 70 shares, user1 has 30 shares
      const creatorShare = (channelAmount * 70n) / 100n;
      const user1Share = (channelAmount * 30n) / 100n;

      // Check if platform fee recipient received tokens
      expect(await mockERC20.balanceOf(platformFeeRecipient.address)).to.equal(
        platformFee
      );

      // Check claimable token revenue
      expect(
        await revenueDistribution.getClaimableTokenRevenue(
          channelId,
          await mockERC20.getAddress(),
          creator.address
        )
      ).to.equal(creatorShare);

      expect(
        await revenueDistribution.getClaimableTokenRevenue(
          channelId,
          await mockERC20.getAddress(),
          user1.address
        )
      ).to.equal(user1Share);
    });

    it("Should allow claiming specific token revenue", async function () {
      // Add token revenue
      await revenueDistribution
        .connect(user2)
        .addTokenRevenue(channelId, await mockERC20.getAddress(), tokenAmount);

      // Calculate expected share
      const platformFee =
        (tokenAmount * BigInt(platformFeePercentage)) / 10000n;
      const channelAmount = tokenAmount - platformFee;
      const expectedCreatorShare = (channelAmount * 70n) / 100n;

      // Check creator has no tokens initially
      expect(await mockERC20.balanceOf(creator.address)).to.equal(0);

      // Creator claims token revenue
      await revenueDistribution
        .connect(creator)
        .claimTokenRevenue(channelId, await mockERC20.getAddress());

      // Check creator received the tokens
      expect(await mockERC20.balanceOf(creator.address)).to.equal(
        expectedCreatorShare
      );

      // Check claimed token amount is recorded
      expect(
        await revenueDistribution.claimedTokenRevenue(
          channelId,
          creator.address,
          await mockERC20.getAddress()
        )
      ).to.equal(expectedCreatorShare);

      // Creator tries to claim again - should have nothing to claim
      await expect(
        revenueDistribution
          .connect(creator)
          .claimTokenRevenue(channelId, await mockERC20.getAddress())
      ).to.be.reverted;
    });

    it("Should support multiple tokens", async function () {
      // Add revenue from two different tokens
      await revenueDistribution
        .connect(user2)
        .addTokenRevenue(channelId, await mockERC20.getAddress(), tokenAmount);

      await revenueDistribution
        .connect(user2)
        .addTokenRevenue(
          channelId,
          await mockERC20_2.getAddress(),
          tokenAmount
        );

      // Calculate expected shares
      const platformFee =
        (tokenAmount * BigInt(platformFeePercentage)) / 10000n;
      const channelAmount = tokenAmount - platformFee;
      const expectedCreatorShare = (channelAmount * 70n) / 100n;

      // Check supported tokens list
      const supportedTokens = await revenueDistribution.getSupportedTokens(
        channelId
      );
      expect(supportedTokens.length).to.equal(2);
      expect(supportedTokens).to.include(await mockERC20.getAddress());
      expect(supportedTokens).to.include(await mockERC20_2.getAddress());

      // Check getAllClaimableTokenRevenue
      const [tokens, amounts] =
        await revenueDistribution.getAllClaimableTokenRevenue(
          channelId,
          creator.address
        );
      expect(tokens.length).to.equal(2);
      expect(amounts.length).to.equal(2);
      expect(amounts[0]).to.equal(expectedCreatorShare);
      expect(amounts[1]).to.equal(expectedCreatorShare);
    });

    it("Should allow claiming all token revenue at once", async function () {
      // Add revenue from two different tokens
      await revenueDistribution
        .connect(user2)
        .addTokenRevenue(channelId, await mockERC20.getAddress(), tokenAmount);

      await revenueDistribution
        .connect(user2)
        .addTokenRevenue(
          channelId,
          await mockERC20_2.getAddress(),
          tokenAmount
        );

      // Calculate expected shares
      const platformFee =
        (tokenAmount * BigInt(platformFeePercentage)) / 10000n;
      const channelAmount = tokenAmount - platformFee;
      const expectedCreatorShare = (channelAmount * 70n) / 100n;

      // Check creator has no tokens initially
      expect(await mockERC20.balanceOf(creator.address)).to.equal(0);
      expect(await mockERC20_2.balanceOf(creator.address)).to.equal(0);

      // Creator claims all token revenue
      await revenueDistribution
        .connect(creator)
        .claimAllTokenRevenue(channelId);

      // Check creator received both token types
      expect(await mockERC20.balanceOf(creator.address)).to.equal(
        expectedCreatorShare
      );
      expect(await mockERC20_2.balanceOf(creator.address)).to.equal(
        expectedCreatorShare
      );

      // Check claimed token amounts are recorded
      expect(
        await revenueDistribution.claimedTokenRevenue(
          channelId,
          creator.address,
          await mockERC20.getAddress()
        )
      ).to.equal(expectedCreatorShare);

      expect(
        await revenueDistribution.claimedTokenRevenue(
          channelId,
          creator.address,
          await mockERC20_2.getAddress()
        )
      ).to.equal(expectedCreatorShare);

      // Creator tries to claim again - should have nothing to claim
      await expect(
        revenueDistribution.connect(creator).claimAllTokenRevenue(channelId)
      ).to.be.reverted;
    });

    it("Should reject token claims from users with no shares", async function () {
      // Add token revenue
      await revenueDistribution
        .connect(user2)
        .addTokenRevenue(channelId, await mockERC20.getAddress(), tokenAmount);

      // User2 has no shares, should fail to claim
      await expect(
        revenueDistribution
          .connect(user2)
          .claimTokenRevenue(channelId, await mockERC20.getAddress())
      ).to.be.reverted;
    });
  });

  describe("Fee Management", function () {
    it("Should allow owner to update platform fee percentage", async function () {
      const newFee = 300; // 3%
      await revenueDistribution.connect(owner).setPlatformFeePercentage(newFee);
      expect(await revenueDistribution.platformFeePercentage()).to.equal(
        newFee
      );
    });

    it("Should prevent setting fee too high", async function () {
      await expect(
        revenueDistribution.connect(owner).setPlatformFeePercentage(6000) // 60%
      ).to.be.reverted;
    });

    it("Should allow owner to update fee recipient", async function () {
      await revenueDistribution
        .connect(owner)
        .setPlatformFeeRecipient(user2.address);
      expect(await revenueDistribution.platformFeeRecipient()).to.equal(
        user2.address
      );
    });

    it("Should prevent setting fee recipient to zero address", async function () {
      await expect(
        revenueDistribution
          .connect(owner)
          .setPlatformFeeRecipient(ethers.ZeroAddress)
      ).to.be.reverted;
    });
  });
});
