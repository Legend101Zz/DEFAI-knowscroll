import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { parseEther } from "ethers";

// Import TypeChain generated types
import { ChannelNFT } from "../typechain-types/contracts/ChannelNFT.sol";
import { Marketplace } from "../typechain-types/contracts/Marketplace.sol";

describe("Marketplace", function () {
  let channelNFT: ChannelNFT;
  let marketplace: Marketplace;
  let owner: HardhatEthersSigner;
  let creator: HardhatEthersSigner;
  let buyer: HardhatEthersSigner;
  let feeRecipient: HardhatEthersSigner;

  const baseURI = "https://ipfs.io/ipfs/";
  const marketplaceFeePercentage = 250; // 2.5%

  beforeEach(async function () {
    // Get signers
    [owner, creator, buyer, feeRecipient] = await ethers.getSigners();

    // Deploy ChannelNFT contract
    const ChannelNFTFactory = await ethers.getContractFactory("ChannelNFT");
    channelNFT = (await ChannelNFTFactory.deploy(
      baseURI
    )) as unknown as ChannelNFT;
    await channelNFT.waitForDeployment();

    // Deploy Marketplace contract
    const MarketplaceFactory = await ethers.getContractFactory("Marketplace");
    marketplace = (await MarketplaceFactory.deploy(
      await channelNFT.getAddress(),
      marketplaceFeePercentage,
      feeRecipient.address
    )) as unknown as Marketplace;
    await marketplace.waitForDeployment();

    // Create a test channel
    await channelNFT
      .connect(creator)
      .createChannel("Test Channel", "Test Description", "Education", 100);

    // Approve marketplace to transfer NFTs on behalf of creator
    await channelNFT
      .connect(creator)
      .setApprovalForAll(await marketplace.getAddress(), true);
  });

  describe("Deployment", function () {
    it("Should set the correct parameters", async function () {
      expect(await marketplace.channelNFT()).to.equal(
        await channelNFT.getAddress()
      );
      expect(await marketplace.marketplaceFeePercentage()).to.equal(
        marketplaceFeePercentage
      );
      expect(await marketplace.feeRecipient()).to.equal(feeRecipient.address);
    });

    it("Should reject invalid initialization parameters", async function () {
      const MarketplaceFactory = await ethers.getContractFactory("Marketplace");

      // Zero address for channelNFT
      await expect(
        MarketplaceFactory.deploy(
          ethers.ZeroAddress,
          marketplaceFeePercentage,
          feeRecipient.address
        )
      ).to.be.revertedWithCustomError(
        MarketplaceFactory,
        "Marketplace: zero address for channelNFT"
      );

      // Zero address for fee recipient
      await expect(
        MarketplaceFactory.deploy(
          await channelNFT.getAddress(),
          marketplaceFeePercentage,
          ethers.ZeroAddress
        )
      ).to.be.revertedWithCustomError(
        MarketplaceFactory,
        "Marketplace: zero address for fee recipient"
      );

      // Fee too high
      await expect(
        MarketplaceFactory.deploy(
          await channelNFT.getAddress(),
          1500, // 15%
          feeRecipient.address
        )
      ).to.be.revertedWithCustomError(
        MarketplaceFactory,
        "Marketplace: fee too high"
      );
    });
  });

  describe("Listing Creation", function () {
    const channelId = 1n;
    const amount = 20n;
    const pricePerShare = parseEther("0.1"); // 0.1 ETH

    it("Should create a listing correctly", async function () {
      const listingTx = await marketplace
        .connect(creator)
        .createListing(channelId, amount, pricePerShare);

      // Check the event was emitted
      await expect(listingTx)
        .to.emit(marketplace, "ListingCreated")
        .withArgs(1n, creator.address, channelId, amount, pricePerShare);

      // Check listing details
      const listing = await marketplace.listings(1n);
      expect(listing.seller).to.equal(creator.address);
      expect(listing.channelId).to.equal(channelId);
      expect(listing.amount).to.equal(amount);
      expect(listing.pricePerShare).to.equal(pricePerShare);
      expect(listing.active).to.equal(true);
    });

    it("Should transfer NFTs to marketplace when listing", async function () {
      const creatorBalanceBefore = await channelNFT.balanceOf(
        creator.address,
        channelId
      );

      await marketplace
        .connect(creator)
        .createListing(channelId, amount, pricePerShare);

      const creatorBalanceAfter = await channelNFT.balanceOf(
        creator.address,
        channelId
      );
      const marketplaceBalance = await channelNFT.balanceOf(
        await marketplace.getAddress(),
        channelId
      );

      expect(creatorBalanceAfter).to.equal(creatorBalanceBefore - amount);
      expect(marketplaceBalance).to.equal(amount);
    });

    it("Should reject listing with invalid parameters", async function () {
      // Zero amount
      await expect(
        marketplace.connect(creator).createListing(channelId, 0n, pricePerShare)
      ).to.be.revertedWith("Marketplace: amount must be greater than 0");

      // Zero price
      await expect(
        marketplace.connect(creator).createListing(channelId, amount, 0n)
      ).to.be.revertedWith("Marketplace: price must be greater than 0");

      // Not enough shares owned
      await expect(
        marketplace
          .connect(creator)
          .createListing(channelId, 200n, pricePerShare) // Creator only has 100 shares
      ).to.be.revertedWith("Marketplace: not enough shares owned");
    });
  });

  describe("Listing Management", function () {
    const channelId = 1n;
    const amount = 20n;
    const pricePerShare = parseEther("0.1"); // 0.1 ETH
    let listingId: bigint;

    beforeEach(async function () {
      // Create a listing
      await marketplace
        .connect(creator)
        .createListing(channelId, amount, pricePerShare);
      listingId = 1n;
    });

    it("Should allow updating a listing's amount", async function () {
      const newAmount = 30n;

      await marketplace
        .connect(creator)
        .updateListing(listingId, newAmount, 0n);

      const listing = await marketplace.listings(listingId);
      expect(listing.amount).to.equal(newAmount);

      // Check NFT balances
      const marketplaceBalance = await channelNFT.balanceOf(
        await marketplace.getAddress(),
        channelId
      );
      expect(marketplaceBalance).to.equal(newAmount);
    });

    it("Should allow updating a listing's price", async function () {
      const newPrice = parseEther("0.2"); // 0.2 ETH

      await marketplace.connect(creator).updateListing(listingId, 0n, newPrice);

      const listing = await marketplace.listings(listingId);
      expect(listing.pricePerShare).to.equal(newPrice);
    });

    it("Should allow canceling a listing", async function () {
      const creatorBalanceBefore = await channelNFT.balanceOf(
        creator.address,
        channelId
      );

      await marketplace.connect(creator).cancelListing(listingId);

      // Check listing status
      const listing = await marketplace.listings(listingId);
      expect(listing.active).to.equal(false);

      // Check NFTs were returned to creator
      const creatorBalanceAfter = await channelNFT.balanceOf(
        creator.address,
        channelId
      );
      const marketplaceBalance = await channelNFT.balanceOf(
        await marketplace.getAddress(),
        channelId
      );

      expect(creatorBalanceAfter).to.equal(creatorBalanceBefore + amount);
      expect(marketplaceBalance).to.equal(0n);
    });

    it("Should prevent non-seller from updating listing", async function () {
      await expect(
        marketplace.connect(buyer).updateListing(listingId, 30n, 0n)
      ).to.be.revertedWith("Marketplace: not the seller");
    });

    it("Should prevent non-seller from canceling listing", async function () {
      await expect(
        marketplace.connect(buyer).cancelListing(listingId)
      ).to.be.revertedWith("Marketplace: not seller or owner");
    });
  });

  describe("Purchasing Shares", function () {
    const channelId = 1n;
    const amount = 20n;
    const pricePerShare = parseEther("0.1"); // 0.1 ETH
    let listingId: bigint;

    beforeEach(async function () {
      // Create a listing
      await marketplace
        .connect(creator)
        .createListing(channelId, amount, pricePerShare);
      listingId = 1n;
    });

    it("Should allow buying shares", async function () {
      const purchaseAmount = 10n;
      const totalPrice = (pricePerShare * purchaseAmount) / 1n;
      const marketplaceFee =
        (totalPrice * BigInt(marketplaceFeePercentage)) / 10000n;
      const sellerProceeds = totalPrice - marketplaceFee;

      // Get initial balances
      const feeRecipientInitialBalance = await ethers.provider.getBalance(
        feeRecipient.address
      );
      const creatorInitialBalance = await ethers.provider.getBalance(
        creator.address
      );
      const buyerInitialBalance = await channelNFT.balanceOf(
        buyer.address,
        channelId
      );

      // Buyer purchases shares
      await marketplace
        .connect(buyer)
        .purchaseShares(listingId, purchaseAmount, {
          value: totalPrice,
        });

      // Check listing was updated
      const listing = await marketplace.listings(listingId);
      expect(listing.amount).to.equal(amount - purchaseAmount);
      expect(listing.active).to.equal(true);

      // Check NFTs were transferred to buyer
      const buyerFinalBalance = await channelNFT.balanceOf(
        buyer.address,
        channelId
      );
      expect(buyerFinalBalance).to.equal(buyerInitialBalance + purchaseAmount);

      // Check marketplace fee was paid
      const feeRecipientFinalBalance = await ethers.provider.getBalance(
        feeRecipient.address
      );
      expect(feeRecipientFinalBalance).to.equal(
        feeRecipientInitialBalance + marketplaceFee
      );

      // Check seller received proceeds
      const creatorFinalBalance = await ethers.provider.getBalance(
        creator.address
      );
      expect(creatorFinalBalance).to.equal(
        creatorInitialBalance + sellerProceeds
      );
    });

    it("Should make listing inactive when all shares are purchased", async function () {
      // Buyer purchases all shares
      await marketplace.connect(buyer).purchaseShares(listingId, amount, {
        value: (pricePerShare * amount) / 1n,
      });

      // Check listing status
      const listing = await marketplace.listings(listingId);
      expect(listing.amount).to.equal(0n);
      expect(listing.active).to.equal(false);
    });

    it("Should refund excess payment", async function () {
      const purchaseAmount = 10n;
      const totalPrice = (pricePerShare * purchaseAmount) / 1n;
      const overpayment = parseEther("1"); // 1 ETH extra

      // Get buyer's initial balance
      const buyerInitialBalance = await ethers.provider.getBalance(
        buyer.address
      );

      // Buyer purchases shares with overpayment
      const tx = await marketplace
        .connect(buyer)
        .purchaseShares(listingId, purchaseAmount, {
          value: totalPrice + overpayment,
        });

      // Calculate gas used
      const receipt = await tx.wait();
      const gasUsed = receipt ? BigInt(receipt.gasUsed * receipt.gasPrice) : 0n;

      // Check buyer's final balance (should be initial - totalPrice - gasUsed)
      const buyerFinalBalance = await ethers.provider.getBalance(buyer.address);

      // Use closeTo for checking balances
      const expectedBalance = buyerInitialBalance - totalPrice - gasUsed;
      const diff =
        buyerFinalBalance > expectedBalance
          ? buyerFinalBalance - expectedBalance
          : expectedBalance - buyerFinalBalance;

      expect(diff < parseEther("0.001")).to.be.true;
    });

    it("Should reject purchases with insufficient payment", async function () {
      const purchaseAmount = 10n;
      const totalPrice = (pricePerShare * purchaseAmount) / 1n;
      const insufficientPayment = totalPrice - parseEther("0.05");

      await expect(
        marketplace.connect(buyer).purchaseShares(listingId, purchaseAmount, {
          value: insufficientPayment,
        })
      ).to.be.revertedWith("Marketplace: insufficient payment");
    });

    it("Should reject purchases from inactive listings", async function () {
      // Cancel the listing
      await marketplace.connect(creator).cancelListing(listingId);

      // Attempt to purchase
      await expect(
        marketplace.connect(buyer).purchaseShares(listingId, 10n, {
          value: pricePerShare * 10n,
        })
      ).to.be.revertedWith("Marketplace: listing not active");
    });

    it("Should reject purchases with invalid amount", async function () {
      // Zero amount
      await expect(
        marketplace.connect(buyer).purchaseShares(listingId, 0n, {
          value: 0n,
        })
      ).to.be.revertedWith("Marketplace: invalid amount");

      // Amount greater than available
      await expect(
        marketplace.connect(buyer).purchaseShares(listingId, amount + 10n, {
          value: pricePerShare * (amount + 10n),
        })
      ).to.be.revertedWith("Marketplace: invalid amount");
    });
  });

  describe("Fee Management", function () {
    it("Should allow owner to update marketplace fee percentage", async function () {
      const newFee = 300; // 3%
      await marketplace.connect(owner).setMarketplaceFeePercentage(newFee);
      expect(await marketplace.marketplaceFeePercentage()).to.equal(newFee);
    });

    it("Should prevent setting fee too high", async function () {
      await expect(
        marketplace.connect(owner).setMarketplaceFeePercentage(1500) // 15%
      ).to.be.revertedWith("Marketplace: fee too high");
    });

    it("Should allow owner to update fee recipient", async function () {
      await marketplace.connect(owner).setFeeRecipient(buyer.address);
      expect(await marketplace.feeRecipient()).to.equal(buyer.address);
    });

    it("Should prevent setting fee recipient to zero address", async function () {
      await expect(
        marketplace.connect(owner).setFeeRecipient(ethers.ZeroAddress)
      ).to.be.revertedWith("Marketplace: zero address");
    });
  });

  describe("Listings Queries", function () {
    beforeEach(async function () {
      // Create multiple listings
      await marketplace
        .connect(creator)
        .createListing(1n, 10n, parseEther("0.1"));
      await marketplace
        .connect(creator)
        .createListing(1n, 20n, parseEther("0.2"));
      await channelNFT
        .connect(buyer)
        .createChannel("Buyer Channel", "Description", "Education", 100);
      await channelNFT
        .connect(buyer)
        .setApprovalForAll(await marketplace.getAddress(), true);
      await marketplace
        .connect(buyer)
        .createListing(2n, 30n, parseEther("0.3"));
    });

    it("Should return correct listings by seller", async function () {
      const creatorListings = await marketplace.getListingsBySeller(
        creator.address
      );
      const buyerListings = await marketplace.getListingsBySeller(
        buyer.address
      );

      expect(creatorListings.length).to.equal(2);
      expect(creatorListings[0]).to.equal(1n);
      expect(creatorListings[1]).to.equal(2n);

      expect(buyerListings.length).to.equal(1);
      expect(buyerListings[0]).to.equal(3n);
    });

    it("Should return correct total listings count", async function () {
      const totalListings = await marketplace.getTotalListingsCount();
      expect(totalListings).to.equal(3n);
    });
  });
});
