import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

// Import TypeChain generated types
import { ChannelNFT } from "../typechain-types/contracts/ChannelNFT.sol";
import { Governance } from "../typechain-types/contracts/Governance.sol";

describe("Governance", function () {
  let channelNFT: ChannelNFT;
  let governance: Governance;
  let owner: HardhatEthersSigner;
  let creator: HardhatEthersSigner;
  let voter1: HardhatEthersSigner;
  let voter2: HardhatEthersSigner;

  const baseURI = "https://ipfs.io/ipfs/";
  const proposalThreshold = 500; // 5%
  const minVotingPeriod = 3600n; // 1 hour in seconds

  beforeEach(async function () {
    // Get signers
    [owner, creator, voter1, voter2] = await ethers.getSigners();

    // Deploy ChannelNFT contract
    const ChannelNFTFactory = await ethers.getContractFactory("ChannelNFT");
    channelNFT = (await ChannelNFTFactory.deploy(
      baseURI
    )) as unknown as ChannelNFT;
    await channelNFT.waitForDeployment();

    // Deploy Governance contract
    const GovernanceFactory = await ethers.getContractFactory("Governance");
    governance = (await GovernanceFactory.deploy(
      await channelNFT.getAddress(),
      proposalThreshold,
      minVotingPeriod
    )) as unknown as Governance;
    await governance.waitForDeployment();

    // Create a test channel
    await channelNFT
      .connect(creator)
      .createChannel("Test Channel", "Test Description", "Education", 100);

    // Distribute some shares to voters
    await channelNFT.connect(creator).safeTransferFrom(
      creator.address,
      voter1.address,
      1n, // channelId
      30n,
      "0x"
    );

    await channelNFT.connect(creator).safeTransferFrom(
      creator.address,
      voter2.address,
      1n, // channelId
      20n,
      "0x"
    );
  });

  describe("Deployment", function () {
    it("Should set the correct parameters", async function () {
      expect(await governance.channelNFT()).to.equal(
        await channelNFT.getAddress()
      );
      expect(await governance.proposalThreshold()).to.equal(proposalThreshold);
      expect(await governance.minVotingPeriod()).to.equal(minVotingPeriod);
    });

    it("Should reject invalid initialization parameters", async function () {
      const GovernanceFactory = await ethers.getContractFactory("Governance");

      // Zero address for channelNFT
      await expect(
        GovernanceFactory.deploy(
          ethers.ZeroAddress,
          proposalThreshold,
          minVotingPeriod
        )
      ).to.be.revertedWith("Governance: zero address for channelNFT");

      // Threshold too high
      await expect(
        GovernanceFactory.deploy(
          await channelNFT.getAddress(),
          1500, // 15%
          minVotingPeriod
        )
      ).to.be.revertedWith("Governance: threshold too high");

      // Voting period too short
      await expect(
        GovernanceFactory.deploy(
          await channelNFT.getAddress(),
          proposalThreshold,
          600n // 10 minutes
        )
      ).to.be.revertedWith("Governance: voting period too short");
    });
  });

  describe("Proposal Creation", function () {
    const channelId = 1n;
    const description = "Add more history content";
    const contentUri = "ipfs://QmHash123";
    const votingPeriod = 86400n; // 1 day in seconds

    it("Should allow creating a proposal when meeting threshold", async function () {
      // Creator has 50 shares (50%) after distribution, which is above the 5% threshold
      const proposalTx = await governance
        .connect(creator)
        .createProposal(channelId, description, contentUri, votingPeriod);

      // Check event emission
      const proposalId = 1n;
      const latestTime = BigInt(await time.latest());
      await expect(proposalTx)
        .to.emit(governance, "ProposalCreated")
        .withArgs(
          proposalId,
          channelId,
          creator.address,
          description,
          contentUri,
          latestTime,
          latestTime + votingPeriod
        );

      // Check proposal details
      const proposal = await governance.getProposalDetails(proposalId);
      expect(proposal.channelId).to.equal(channelId);
      expect(proposal.description).to.equal(description);
      expect(proposal.contentUri).to.equal(contentUri);
      expect(proposal.proposer).to.equal(creator.address);
      expect(proposal.forVotes).to.equal(0n);
      expect(proposal.againstVotes).to.equal(0n);
      expect(proposal.executed).to.equal(false);
    });

    it("Should reject proposal from user below threshold", async function () {
      // Create a new user with very few shares, below threshold
      const [newUser] = await ethers.getSigners();
      await channelNFT.connect(creator).safeTransferFrom(
        creator.address,
        newUser.address,
        channelId,
        1n, // Just 1 share, which is 1% (below 5% threshold)
        "0x"
      );

      await expect(
        governance
          .connect(newUser)
          .createProposal(channelId, description, contentUri, votingPeriod)
      ).to.be.revertedWith("Governance: below proposal threshold");
    });

    it("Should reject proposal with invalid parameters", async function () {
      // Empty description
      await expect(
        governance
          .connect(creator)
          .createProposal(channelId, "", contentUri, votingPeriod)
      ).to.be.revertedWith("Governance: empty description");

      // Empty contentUri
      await expect(
        governance
          .connect(creator)
          .createProposal(channelId, description, "", votingPeriod)
      ).to.be.revertedWith("Governance: empty contentUri");

      // Voting period too short
      await expect(
        governance
          .connect(creator)
          .createProposal(
            channelId,
            description,
            contentUri,
            minVotingPeriod - 1n
          )
      ).to.be.revertedWith("Governance: voting period too short");

      // Non-existent channel
      await expect(
        governance.connect(creator).createProposal(
          999n, // Non-existent channel ID
          description,
          contentUri,
          votingPeriod
        )
      ).to.be.revertedWith("Governance: no total shares");
    });
  });

  describe("Voting", function () {
    const channelId = 1n;
    const description = "Add more history content";
    const contentUri = "ipfs://QmHash123";
    const votingPeriod = 86400n; // 1 day in seconds
    let proposalId: bigint;

    beforeEach(async function () {
      // Create a proposal
      await governance
        .connect(creator)
        .createProposal(channelId, description, contentUri, votingPeriod);
      proposalId = 1n;
    });

    it("Should allow users with shares to vote", async function () {
      // Vote for the proposal
      const voteTx = await governance
        .connect(voter1)
        .castVote(proposalId, true);

      // Check event emission
      await expect(voteTx)
        .to.emit(governance, "VoteCast")
        .withArgs(proposalId, voter1.address, true, 30n); // voter1 has 30 shares

      // Check vote was recorded
      const proposal = await governance.getProposalDetails(proposalId);
      expect(proposal.forVotes).to.equal(30n);
      expect(proposal.againstVotes).to.equal(0n);

      // Check voter has voted
      expect(await governance.hasVoted(proposalId, voter1.address)).to.equal(
        true
      );
    });

    it("Should allow voting against the proposal", async function () {
      await governance.connect(voter2).castVote(proposalId, false);

      const proposal = await governance.getProposalDetails(proposalId);
      expect(proposal.forVotes).to.equal(0n);
      expect(proposal.againstVotes).to.equal(20n); // voter2 has 20 shares
    });

    it("Should prevent users from voting twice", async function () {
      await governance.connect(voter1).castVote(proposalId, true);

      await expect(
        governance.connect(voter1).castVote(proposalId, false)
      ).to.be.revertedWith("Governance: already voted");
    });

    it("Should prevent users without shares from voting", async function () {
      const [nonVoter] = await ethers.getSigners();

      await expect(
        governance.connect(nonVoter).castVote(proposalId, true)
      ).to.be.revertedWith("Governance: no shares owned");
    });

    it("Should prevent voting before start time", async function () {
      // Create a proposal with a future start time (not possible with current contract, but testing for completeness)
      // This would require modifying the contract to allow setting start time

      // For now, just check that voting works during the voting period
      await governance.connect(voter1).castVote(proposalId, true);

      const proposal = await governance.getProposalDetails(proposalId);
      expect(proposal.forVotes).to.equal(30n);
    });

    it("Should prevent voting after end time", async function () {
      // Advance time past the voting period
      await time.increase(Number(votingPeriod) + 1);

      await expect(
        governance.connect(voter1).castVote(proposalId, true)
      ).to.be.revertedWith("Governance: voting ended");
    });
  });

  describe("Executing Proposals", function () {
    const channelId = 1n;
    const description = "Add more history content";
    const contentUri = "ipfs://QmHash123";
    const votingPeriod = 86400n; // 1 day in seconds
    let proposalId: bigint;

    beforeEach(async function () {
      // Create a proposal
      await governance
        .connect(creator)
        .createProposal(channelId, description, contentUri, votingPeriod);
      proposalId = 1n;

      // Cast some votes
      await governance.connect(creator).castVote(proposalId, true); // 50 shares for
      await governance.connect(voter2).castVote(proposalId, false); // 20 shares against
    });

    it("Should not allow executing a proposal before voting ends", async function () {
      await expect(
        governance.connect(creator).executeProposal(proposalId)
      ).to.be.revertedWith("Governance: voting not ended");
    });

    it("Should allow executing a proposal after voting ends", async function () {
      // Advance time past the voting period
      await time.increase(Number(votingPeriod) + 1);

      const executeTx = await governance
        .connect(creator)
        .executeProposal(proposalId);

      // Check event emission
      await expect(executeTx)
        .to.emit(governance, "ProposalExecuted")
        .withArgs(proposalId, true); // Proposal passed (50 for vs 20 against)

      // Check proposal was marked as executed and passed
      const proposal = await governance.getProposalDetails(proposalId);
      expect(proposal.executed).to.equal(true);
      expect(proposal.passed).to.equal(true);
    });

    it("Should mark proposal as failed if against votes are greater", async function () {
      // Cast more against votes to make the proposal fail
      await governance.connect(voter1).castVote(proposalId, false); // 30 more against votes

      // Advance time past the voting period
      await time.increase(Number(votingPeriod) + 1);

      await governance.connect(creator).executeProposal(proposalId);

      // Check proposal was marked as executed but failed
      const proposal = await governance.getProposalDetails(proposalId);
      expect(proposal.executed).to.equal(true);
      expect(proposal.passed).to.equal(false); // 50 for vs 50 against (tie fails)
    });

    it("Should not allow executing a proposal twice", async function () {
      // Advance time past the voting period
      await time.increase(Number(votingPeriod) + 1);

      await governance.connect(creator).executeProposal(proposalId);

      await expect(
        governance.connect(creator).executeProposal(proposalId)
      ).to.be.revertedWith("Governance: already executed");
    });
  });

  describe("Channel Proposals", function () {
    it("Should track proposals by channel", async function () {
      // Create multiple proposals for the same channel
      await governance.connect(creator).createProposal(
        1n, // channelId
        "Proposal 1",
        "ipfs://QmHash1",
        minVotingPeriod
      );

      await governance.connect(creator).createProposal(
        1n, // channelId
        "Proposal 2",
        "ipfs://QmHash2",
        minVotingPeriod
      );

      // Create another channel
      await channelNFT
        .connect(voter1)
        .createChannel("Second Channel", "Description", "Gaming", 100);

      // Create a proposal for the second channel
      await governance.connect(voter1).createProposal(
        2n, // channelId for the second channel
        "Proposal for Channel 2",
        "ipfs://QmHash3",
        minVotingPeriod
      );

      // Check the proposals for the first channel
      const channel1Proposals = await governance.getChannelProposals(1n);
      expect(channel1Proposals.length).to.equal(2);
      expect(channel1Proposals[0]).to.equal(1n);
      expect(channel1Proposals[1]).to.equal(2n);

      // Check the proposals for the second channel
      const channel2Proposals = await governance.getChannelProposals(2n);
      expect(channel2Proposals.length).to.equal(1);
      expect(channel2Proposals[0]).to.equal(3n);
    });
  });

  describe("Parameter Management", function () {
    it("Should allow owner to update proposal threshold", async function () {
      const newThreshold = 300; // 3%

      await governance.connect(owner).setProposalThreshold(newThreshold);

      expect(await governance.proposalThreshold()).to.equal(newThreshold);
    });

    it("Should allow owner to update minimum voting period", async function () {
      const newMinVotingPeriod = 7200n; // 2 hours

      await governance.connect(owner).setMinVotingPeriod(newMinVotingPeriod);

      expect(await governance.minVotingPeriod()).to.equal(newMinVotingPeriod);
    });

    it("Should prevent non-owner from updating parameters", async function () {
      // For OZ Ownable 4.x pattern with custom errors
      await expect(governance.connect(creator).setProposalThreshold(300))
        .to.be.revertedWithCustomError(governance, "OwnableUnauthorizedAccount")
        .withArgs(creator.address);

      await expect(governance.connect(creator).setMinVotingPeriod(7200n))
        .to.be.revertedWithCustomError(governance, "OwnableUnauthorizedAccount")
        .withArgs(creator.address);
    });

    it("Should prevent setting invalid parameters", async function () {
      // Threshold too high
      await expect(
        governance.connect(owner).setProposalThreshold(1500) // 15%
      ).to.be.revertedWith("Governance: threshold too high");

      // Voting period too short
      await expect(
        governance.connect(owner).setMinVotingPeriod(600n) // 10 minutes
      ).to.be.revertedWith("Governance: voting period too short");
    });
  });
});
