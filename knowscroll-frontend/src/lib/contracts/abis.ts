// ChannelNFT ABI
export const ChannelNFTAbi = [
  "function getChannel(uint256 channelId) external view returns (tuple(string name, string description, string category, address creator, uint256 totalShares, uint256 createdAt, bool active))",
  "function balanceOf(address account, uint256 id) external view returns (uint256)",
  "function createChannel(string memory name, string memory description, string memory category, uint256 initialShares) external returns (uint256)",
  "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) external",
  "function getTotalShares(uint256 channelId) public view returns (uint256)",
  "function getCreatedChannels(address creator) external view returns (uint256[] memory)",
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address account, address operator) external view returns (bool)",
  "function getTotalChannels() external view returns (uint256)",
];

// RevenueDistribution ABI
export const RevenueDistributionAbi = [
  "function addRevenue(uint256 channelId) external payable",
  "function claimRevenue(uint256 channelId) external",
  "function getClaimableRevenue(uint256 channelId, address shareholder) external view returns (uint256)",
  "function channelRevenue(uint256) external view returns (uint256)",
];

// Marketplace ABI
export const MarketplaceAbi = [
  "function createListing(uint256 channelId, uint256 amount, uint256 pricePerShare) external returns (uint256)",
  "function cancelListing(uint256 listingId) external",
  "function purchaseShares(uint256 listingId, uint256 amount) external payable",
  "function getListing(uint256 listingId) external view returns (tuple(address seller, uint256 channelId, uint256 amount, uint256 pricePerShare, uint256 listedAt, bool active))",
  "function getListingsBySeller(address seller) external view returns (uint256[] memory)",
  "function getTotalListingsCount() external view returns (uint256)",
];

// Governance ABI
export const GovernanceAbi = [
  "function createProposal(uint256 channelId, string memory description, string memory contentUri, uint256 votingPeriod) external returns (uint256)",
  "function castVote(uint256 proposalId, bool support) external",
  "function getProposalDetails(uint256 proposalId) external view returns (uint256 channelId, string memory description, string memory contentUri, uint256 startTime, uint256 endTime, address proposer, uint256 forVotes, uint256 againstVotes, bool executed, bool passed)",
  "function getChannelProposals(uint256 channelId) external view returns (uint256[] memory)",
  "function hasVoted(uint256 proposalId, address voter) external view returns (bool)",
];
