import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

// Import the contract types
import { ContentApproval } from "../typechain-types/contracts/ContentApproval";
import { ChannelNFT } from "../typechain-types/contracts/ChannelNFT.sol";

describe("ContentApproval", function () {
  let contentApproval: ContentApproval;
  let channelNFT: ChannelNFT;
  let owner: HardhatEthersSigner;
  let creator: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let agent: HardhatEthersSigner;

  const baseURI = "https://ipfs.io/ipfs/";
  const quorumThreshold = 2000; // 20%
  const minVotingPeriod = 3600; // 1 hour in seconds

  beforeEach(async function () {
    // Get signers
    [owner, creator, user1, user2, agent] = await ethers.getSigners();

    // Deploy ChannelNFT contract (required for integration)
    const ChannelNFTFactory = await ethers.getContractFactory("ChannelNFT");
    channelNFT = (await ChannelNFTFactory.deploy(
      baseURI
    )) as unknown as ChannelNFT;
    await channelNFT.waitForDeployment();

    // Deploy ContentApproval contract
    const ContentApprovalFactory = await ethers.getContractFactory(
      "ContentApproval"
    );
    contentApproval = (await ContentApprovalFactory.deploy(
      await channelNFT.getAddress(),
      quorumThreshold,
      minVotingPeriod
    )) as unknown as ContentApproval;
    await contentApproval.waitForDeployment();

    // Create a test channel
    await channelNFT.connect(creator).createChannel(
      "Test Channel",
      "Test Description",
      "Education",
      100 // 100 total shares
    );

    // Distribute shares to users for voting
    await channelNFT.connect(creator).safeTransferFrom(
      creator.address,
      user1.address,
      1, // channelId
      30, // 30% of shares
      "0x"
    );

    await channelNFT.connect(creator).safeTransferFrom(
      creator.address,
      user2.address,
      1, // channelId
      20, // 20% of shares
      "0x"
    );
  });

  describe("Deployment", function () {
    it("Should set the correct parameters", async function () {
      expect(await contentApproval.channelNFT()).to.equal(
        await channelNFT.getAddress()
      );
      expect(await contentApproval.quorumThreshold()).to.equal(quorumThreshold);
      expect(await contentApproval.minVotingPeriod()).to.equal(minVotingPeriod);
    });

    it("Should reject invalid initialization parameters", async function () {
      const ContentApprovalFactory = await ethers.getContractFactory(
        "ContentApproval"
      );

      // Zero address for channelNFT
      await expect(
        ContentApprovalFactory.deploy(
          ethers.ZeroAddress,
          quorumThreshold,
          minVotingPeriod
        )
      ).to.be.revertedWith("ContentApproval: zero address for channelNFT");

      // Threshold too high
      await expect(
        ContentApprovalFactory.deploy(
          await channelNFT.getAddress(),
          5500, // 55%
          minVotingPeriod
        )
      ).to.be.revertedWith("ContentApproval: threshold too high");

      // Voting period too short
      await expect(
        ContentApprovalFactory.deploy(
          await channelNFT.getAddress(),
          quorumThreshold,
          1800 // 30 minutes
        )
      ).to.be.revertedWith("ContentApproval: voting period too short");
    });
  });

  describe("Content Draft Creation", function () {
    const channelId = 1;
    const title = "Introduction to Blockchain";
    const contentUri = "ipfs://QmContent123";
    const metadataUri = "ipfs://QmMetadata123";
    const proposalId = 1;
    const votingPeriod = 86400; // 1 day

    it("Should create a content draft correctly", async function () {
      const createTx = await contentApproval
        .connect(agent)
        .createContentDraft(
          channelId,
          title,
          contentUri,
          metadataUri,
          proposalId,
          votingPeriod
        );

      // Check event emission
      const contentDraftId = 1;
      await expect(createTx)
        .to.emit(contentApproval, "ContentDraftCreated")
        .withArgs(
          contentDraftId,
          channelId,
          proposalId,
          title,
          contentUri,
          await time.latest(),
          (await time.latest()) + votingPeriod
        );

      // Check content draft details
      const draft = await contentApproval.getContentDraft(contentDraftId);
      expect(draft[0]).to.equal(channelId); // channelId
      expect(draft[1]).to.equal(title); // title
      expect(draft[2]).to.equal(contentUri); // contentUri
      expect(draft[3]).to.equal(metadataUri); // metadataUri
      expect(draft[4]).to.equal(proposalId); // proposalId
      expect(draft[7]).to.equal(agent.address); // creator
      expect(draft[10]).to.equal(false); // executed
      expect(draft[11]).to.equal(false); // approved
    });

    it("Should reject content draft with invalid parameters", async function () {
      // Empty title
      await expect(
        contentApproval.connect(agent).createContentDraft(
          channelId,
          "", // empty title
          contentUri,
          metadataUri,
          proposalId,
          votingPeriod
        )
      ).to.be.revertedWith("ContentApproval: empty title");

      // Empty contentUri
      await expect(
        contentApproval.connect(agent).createContentDraft(
          channelId,
          title,
          "", // empty contentUri
          metadataUri,
          proposalId,
          votingPeriod
        )
      ).to.be.revertedWith("ContentApproval: empty contentUri");

      // Voting period too short
      await expect(
        contentApproval.connect(agent).createContentDraft(
          channelId,
          title,
          contentUri,
          metadataUri,
          proposalId,
          1800 // 30 minutes, below minimum
        )
      ).to.be.revertedWith("ContentApproval: voting period too short");
    });
  });

  describe("Voting", function () {
    const channelId = 1;
    const title = "Introduction to Blockchain";
    const contentUri = "ipfs://QmContent123";
    const metadataUri = "ipfs://QmMetadata123";
    const proposalId = 1;
    const votingPeriod = 86400; // 1 day
    let contentDraftId: number;

    beforeEach(async function () {
      // Create a content draft for testing voting
      await contentApproval
        .connect(agent)
        .createContentDraft(
          channelId,
          title,
          contentUri,
          metadataUri,
          proposalId,
          votingPeriod
        );
      contentDraftId = 1;
    });

    it("Should allow users with shares to vote", async function () {
      // User1 votes FOR
      const voteTx = await contentApproval
        .connect(user1)
        .castVote(contentDraftId, true);

      // Check event emission
      await expect(voteTx)
        .to.emit(contentApproval, "VoteCast")
        .withArgs(contentDraftId, user1.address, true, 30); // user1 has 30 shares

      // Check vote was recorded
      const draft = await contentApproval.getContentDraft(contentDraftId);
      expect(draft[8]).to.equal(30n); // forVotes
      expect(draft[9]).to.equal(0n); // againstVotes

      // Check hasVoted returns true
      expect(
        await contentApproval.hasVoted(contentDraftId, user1.address)
      ).to.equal(true);
    });

    it("Should allow voting against the content", async function () {
      // User2 votes AGAINST
      await contentApproval.connect(user2).castVote(contentDraftId, false);

      const draft = await contentApproval.getContentDraft(contentDraftId);
      expect(draft[8]).to.equal(0n); // forVotes
      expect(draft[9]).to.equal(20n); // againstVotes
    });

    it("Should prevent users from voting twice", async function () {
      await contentApproval.connect(user1).castVote(contentDraftId, true);

      await expect(
        contentApproval.connect(user1).castVote(contentDraftId, false)
      ).to.be.revertedWith("ContentApproval: already voted");
    });

    it("Should prevent users without shares from voting", async function () {
      await expect(
        contentApproval.connect(agent).castVote(contentDraftId, true) // Agent has no shares
      ).to.be.revertedWith("ContentApproval: no shares owned");
    });

    it("Should prevent voting after end time", async function () {
      // Advance time past the voting period
      await time.increase(votingPeriod + 1);

      await expect(
        contentApproval.connect(user1).castVote(contentDraftId, true)
      ).to.be.revertedWith("ContentApproval: voting ended");
    });
  });

  describe("Content Approval Execution", function () {
    const channelId = 1;
    const title = "Introduction to Blockchain";
    const contentUri = "ipfs://QmContent123";
    const metadataUri = "ipfs://QmMetadata123";
    const proposalId = 1;
    const votingPeriod = 86400; // 1 day
    let contentDraftId: number;

    beforeEach(async function () {
      // Create a content draft for testing execution
      await contentApproval
        .connect(agent)
        .createContentDraft(
          channelId,
          title,
          contentUri,
          metadataUri,
          proposalId,
          votingPeriod
        );
      contentDraftId = 1;

      // Creator votes FOR (50 shares)
      await contentApproval.connect(creator).castVote(contentDraftId, true);

      // User2 votes AGAINST (20 shares)
      await contentApproval.connect(user2).castVote(contentDraftId, false);
    });

    it("Should not allow executing before voting ends", async function () {
      await expect(
        contentApproval.connect(agent).executeContentApproval(contentDraftId)
      ).to.be.revertedWith("ContentApproval: voting not ended");
    });

    it("Should allow executing after voting ends and approve content with majority", async function () {
      // Advance time past the voting period
      await time.increase(votingPeriod + 1);

      // Execute the content approval
      const executeTx = await contentApproval
        .connect(agent)
        .executeContentApproval(contentDraftId);

      // Check event emission
      await expect(executeTx)
        .to.emit(contentApproval, "ContentApproved")
        .withArgs(contentDraftId, channelId, contentUri);

      // Check content draft was marked as executed and approved
      const draft = await contentApproval.getContentDraft(contentDraftId);
      expect(draft[10]).to.equal(true); // executed
      expect(draft[11]).to.equal(true); // approved
    });

    it("Should reject content if against votes are greater", async function () {
      // User1 also votes AGAINST (30 shares), giving 50 against vs 50 for
      await contentApproval.connect(user1).castVote(contentDraftId, false);

      // Advance time past the voting period
      await time.increase(votingPeriod + 1);

      // Execute the content approval
      const executeTx = await contentApproval
        .connect(agent)
        .executeContentApproval(contentDraftId);

      // Check event emission
      await expect(executeTx)
        .to.emit(contentApproval, "ContentRejected")
        .withArgs(contentDraftId, channelId);

      // Check content draft was marked as executed but not approved
      const draft = await contentApproval.getContentDraft(contentDraftId);
      expect(draft[10]).to.equal(true); // executed
      expect(draft[11]).to.equal(false); // not approved
    });

    it("Should require quorum to execute", async function () {
      // Deploy a new content approval with a higher quorum threshold
      const highQuorumThreshold = 9000; // 90%
      const ContentApprovalFactory = await ethers.getContractFactory(
        "ContentApproval"
      );
      const highQuorumApproval = await ContentApprovalFactory.deploy(
        await channelNFT.getAddress(),
        highQuorumThreshold,
        minVotingPeriod
      );

      // Create a content draft
      await highQuorumApproval
        .connect(agent)
        .createContentDraft(
          channelId,
          title,
          contentUri,
          metadataUri,
          proposalId,
          votingPeriod
        );

      // Only creator votes (50% of shares), below 90% quorum
      await highQuorumApproval.connect(creator).castVote(1, true);

      // Advance time past the voting period
      await time.increase(votingPeriod + 1);

      // Execute should fail due to not reaching quorum
      await expect(
        highQuorumApproval.connect(agent).executeContentApproval(1)
      ).to.be.revertedWith("ContentApproval: quorum not reached");
    });

    it("Should not allow executing a content draft twice", async function () {
      // Advance time past the voting period
      await time.increase(votingPeriod + 1);

      // Execute the content approval
      await contentApproval
        .connect(agent)
        .executeContentApproval(contentDraftId);

      // Try to execute again
      await expect(
        contentApproval.connect(agent).executeContentApproval(contentDraftId)
      ).to.be.revertedWith("ContentApproval: already executed");
    });
  });

  describe("Querying Content Drafts", function () {
    beforeEach(async function () {
      // Create multiple content drafts
      await contentApproval.connect(agent).createContentDraft(
        1, // channelId
        "Introduction to Blockchain",
        "ipfs://QmContent1",
        "ipfs://QmMetadata1",
        1, // proposalId
        86400 // voting period
      );

      await contentApproval.connect(agent).createContentDraft(
        1, // channelId
        "Advanced Blockchain Concepts",
        "ipfs://QmContent2",
        "ipfs://QmMetadata2",
        2, // proposalId
        86400 // voting period
      );

      // Create a channel and content draft for a different channel
      await channelNFT
        .connect(creator)
        .createChannel(
          "Second Channel",
          "Another Description",
          "Technology",
          100
        );

      await contentApproval.connect(agent).createContentDraft(
        2, // channelId for the second channel
        "Introduction to Second Channel",
        "ipfs://QmContent3",
        "ipfs://QmMetadata3",
        3, // proposalId
        86400 // voting period
      );
    });

    it("Should return correct content drafts by channel", async function () {
      const channel1Drafts = await contentApproval.getChannelContentDrafts(1);
      expect(channel1Drafts.length).to.equal(2);
      expect(channel1Drafts[0]).to.equal(1n);
      expect(channel1Drafts[1]).to.equal(2n);

      const channel2Drafts = await contentApproval.getChannelContentDrafts(2);
      expect(channel2Drafts.length).to.equal(1);
      expect(channel2Drafts[0]).to.equal(3n);
    });

    it("Should return correct total content drafts count", async function () {
      const totalDrafts = await contentApproval.getTotalContentDrafts();
      expect(totalDrafts).to.equal(3n);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update quorum threshold", async function () {
      const newThreshold = 3000; // 30%

      const updateTx = await contentApproval
        .connect(owner)
        .setQuorumThreshold(newThreshold);

      await expect(updateTx)
        .to.emit(contentApproval, "QuorumThresholdUpdated")
        .withArgs(quorumThreshold, newThreshold);

      expect(await contentApproval.quorumThreshold()).to.equal(newThreshold);
    });

    it("Should allow owner to update minimum voting period", async function () {
      const newMinVotingPeriod = 7200; // 2 hours

      const updateTx = await contentApproval
        .connect(owner)
        .setMinVotingPeriod(newMinVotingPeriod);

      await expect(updateTx)
        .to.emit(contentApproval, "MinVotingPeriodUpdated")
        .withArgs(minVotingPeriod, newMinVotingPeriod);

      expect(await contentApproval.minVotingPeriod()).to.equal(
        newMinVotingPeriod
      );
    });

    it("Should prevent non-owner from updating parameters", async function () {
      await expect(contentApproval.connect(user1).setQuorumThreshold(3000))
        .to.be.revertedWithCustomError(
          contentApproval,
          "OwnableUnauthorizedAccount"
        )
        .withArgs(user1.address);

      await expect(contentApproval.connect(user1).setMinVotingPeriod(7200))
        .to.be.revertedWithCustomError(
          contentApproval,
          "OwnableUnauthorizedAccount"
        )
        .withArgs(user1.address);
    });

    it("Should prevent setting invalid parameters", async function () {
      // Threshold too high
      await expect(
        contentApproval.connect(owner).setQuorumThreshold(5500) // 55%
      ).to.be.revertedWith("ContentApproval: threshold too high");

      // Voting period too short
      await expect(
        contentApproval.connect(owner).setMinVotingPeriod(1800) // 30 minutes
      ).to.be.revertedWith("ContentApproval: voting period too short");
    });
  });
});
