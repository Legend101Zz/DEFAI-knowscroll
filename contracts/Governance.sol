// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Governance
 * @dev Contract for channel governance through stakeholder voting
 */
contract Governance is Ownable {
    // ChannelNFT contract address
    address public channelNFT;
    
    // Proposal struct to store proposal information
    struct Proposal {
        uint256 channelId;
        string description;
        string contentUri;      // IPFS URI for proposed content direction
        uint256 startTime;
        uint256 endTime;
        address proposer;
        uint256 forVotes;       // Accumulated voting power for the proposal
        uint256 againstVotes;   // Accumulated voting power against the proposal
        bool executed;
        mapping(address => bool) hasVoted; // Track who has voted
        bool passed;            // Whether the proposal passed
    }
    
    // Minimum percentage of total shares required to create a proposal (in basis points, 5% = 500)
    uint256 public proposalThreshold;
    
    // Minimum voting period in seconds
    uint256 public minVotingPeriod;
    
    // Counter for proposal IDs
    uint256 private _proposalIdCounter;
    
    // Mapping from proposalId to Proposal
    mapping(uint256 => Proposal) public proposals;
    
    // Mapping from channelId to array of proposal IDs
    mapping(uint256 => uint256[]) private _channelProposals;
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        uint256 indexed channelId,
        address indexed proposer,
        string description,
        string contentUri,
        uint256 startTime,
        uint256 endTime
    );
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId, bool passed);
    event ProposalThresholdUpdated(uint256 oldThreshold, uint256 newThreshold);
    event MinVotingPeriodUpdated(uint256 oldPeriod, uint256 newPeriod);
    
    /**
     * @dev Constructor initializes the contract with NFT contract address and governance parameters
     * @param _channelNFT Address of the ChannelNFT contract
     * @param _proposalThreshold Minimum percentage of shares needed to create proposals
     * @param _minVotingPeriod Minimum voting period in seconds
     */
    constructor(
        address _channelNFT,
        uint256 _proposalThreshold,
        uint256 _minVotingPeriod
    ) Ownable(msg.sender) {
        require(_channelNFT != address(0), "Governance: zero address for channelNFT");
        require(_proposalThreshold <= 1000, "Governance: threshold too high"); // Max 10%
        require(_minVotingPeriod >= 1 hours, "Governance: voting period too short");
        
        channelNFT = _channelNFT;
        proposalThreshold = _proposalThreshold;
        minVotingPeriod = _minVotingPeriod;
        _proposalIdCounter = 1; // Start from ID 1
    }
    
    /**
     * @dev Create a new proposal for a channel
     * @param channelId ID of the channel
     * @param description Description of the proposal
     * @param contentUri IPFS URI for proposed content direction
     * @param votingPeriod Voting period in seconds
     */
    function createProposal(
        uint256 channelId,
        string memory description,
        string memory contentUri,
        uint256 votingPeriod
    ) external returns (uint256) {
        require(bytes(description).length > 0, "Governance: empty description");
        require(bytes(contentUri).length > 0, "Governance: empty contentUri");
        require(votingPeriod >= minVotingPeriod, "Governance: voting period too short");
        
        // Get proposer's share balance
        uint256 shares = IERC1155(channelNFT).balanceOf(msg.sender, channelId);
        require(shares > 0, "Governance: no shares owned");
        
        // Get total shares for channel
        uint256 totalShares = getTotalShares(channelId);
        require(totalShares > 0, "Governance: no total shares");
        
        // Check if proposer meets threshold
        uint256 proposerPercentage = (shares * 10000) / totalShares;
        require(proposerPercentage >= proposalThreshold, "Governance: below proposal threshold");
        
        uint256 proposalId = _proposalIdCounter++;
        
        Proposal storage newProposal = proposals[proposalId];
        newProposal.channelId = channelId;
        newProposal.description = description;
        newProposal.contentUri = contentUri;
        newProposal.startTime = block.timestamp;
        newProposal.endTime = block.timestamp + votingPeriod;
        newProposal.proposer = msg.sender;
        newProposal.executed = false;
        
        // Add to channel proposals
        _channelProposals[channelId].push(proposalId);
        
        emit ProposalCreated(
            proposalId,
            channelId,
            msg.sender,
            description,
            contentUri,
            newProposal.startTime,
            newProposal.endTime
        );
        
        return proposalId;
    }
    
    /**
     * @dev Cast a vote on a proposal
     * @param proposalId ID of the proposal
     * @param support Whether to support the proposal
     */
    function castVote(uint256 proposalId, bool support) external {
        require(proposalId < _proposalIdCounter, "Governance: proposal doesn't exist");
        Proposal storage proposal = proposals[proposalId];
        
        require(block.timestamp >= proposal.startTime, "Governance: voting not started");
        require(block.timestamp <= proposal.endTime, "Governance: voting ended");
        require(!proposal.hasVoted[msg.sender], "Governance: already voted");
        
        // Get voter's share balance
        uint256 shares = IERC1155(channelNFT).balanceOf(msg.sender, proposal.channelId);
        require(shares > 0, "Governance: no shares owned");
        
        // Record vote
        proposal.hasVoted[msg.sender] = true;
        
        if (support) {
            proposal.forVotes += shares;
        } else {
            proposal.againstVotes += shares;
        }
        
        emit VoteCast(proposalId, msg.sender, support, shares);
    }
    
    /**
     * @dev Execute a proposal after voting ends
     * @param proposalId ID of the proposal
     */
    function executeProposal(uint256 proposalId) external {
        require(proposalId < _proposalIdCounter, "Governance: proposal doesn't exist");
        Proposal storage proposal = proposals[proposalId];
        
        require(!proposal.executed, "Governance: already executed");
        require(block.timestamp > proposal.endTime, "Governance: voting not ended");
        
        proposal.executed = true;
        
        // Determine if proposal passed
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
        if (totalVotes > 0 && proposal.forVotes > proposal.againstVotes) {
            proposal.passed = true;
        } else {
            proposal.passed = false;
        }
        
        emit ProposalExecuted(proposalId, proposal.passed);
    }
    
    /**
     * @dev Get proposals for a channel
     * @param channelId ID of the channel
     */
    function getChannelProposals(uint256 channelId) external view returns (uint256[] memory) {
        return _channelProposals[channelId];
    }
    
    /**
     * @dev Get proposal details
     * @param proposalId ID of the proposal
     */
    function getProposalDetails(uint256 proposalId) external view returns (
        uint256 channelId,
        string memory description,
        string memory contentUri,
        uint256 startTime,
        uint256 endTime,
        address proposer,
        uint256 forVotes,
        uint256 againstVotes,
        bool executed,
        bool passed
    ) {
        require(proposalId < _proposalIdCounter, "Governance: proposal doesn't exist");
        Proposal storage proposal = proposals[proposalId];
        
        return (
            proposal.channelId,
            proposal.description,
            proposal.contentUri,
            proposal.startTime,
            proposal.endTime,
            proposal.proposer,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.executed,
            proposal.passed
        );
    }
    
    /**
     * @dev Check if an address has voted on a proposal
     * @param proposalId ID of the proposal
     * @param voter Address of the voter
     */
    function hasVoted(uint256 proposalId, address voter) external view returns (bool) {
        require(proposalId < _proposalIdCounter, "Governance: proposal doesn't exist");
        return proposals[proposalId].hasVoted[voter];
    }
    
    /**
     * @dev Get total shares for a channel (helper function)
     * @param channelId ID of the channel
     */
    function getTotalShares(uint256 channelId) public view returns (uint256) {
        // This is a simplified approach. In production, you would get this from ChannelNFT contract
        // Call the ChannelNFT contract to get channel info
        (bool success, bytes memory data) = channelNFT.staticcall(
            abi.encodeWithSignature("getChannel(uint256)", channelId)
        );
        
        require(success, "Governance: failed to get channel info");
        
        // Extract totalShares from the returned data
        // The data layout depends on your Channel struct in ChannelNFT
        // Here we're assuming totalShares is the 5th element (index 4)
        uint256 totalShares;
        assembly {
            // Load totalShares from data
            // Skip first 32 bytes (data length) and 4 * 32 bytes to get to totalShares
            totalShares := mload(add(data, 160)) // 32 + 4*32 = 160
        }
        
        return totalShares;
    }
    
    /**
     * @dev Set the proposal threshold
     * @param _proposalThreshold New proposal threshold
     */
    function setProposalThreshold(uint256 _proposalThreshold) external onlyOwner {
        require(_proposalThreshold <= 1000, "Governance: threshold too high"); // Max 10%
        
        uint256 oldThreshold = proposalThreshold;
        proposalThreshold = _proposalThreshold;
        
        emit ProposalThresholdUpdated(oldThreshold, _proposalThreshold);
    }
    
    /**
     * @dev Set the minimum voting period
     * @param _minVotingPeriod New minimum voting period
     */
    function setMinVotingPeriod(uint256 _minVotingPeriod) external onlyOwner {
        require(_minVotingPeriod >= 1 hours, "Governance: voting period too short");
        
        uint256 oldPeriod = minVotingPeriod;
        minVotingPeriod = _minVotingPeriod;
        
        emit MinVotingPeriodUpdated(oldPeriod, _minVotingPeriod);
    }
}