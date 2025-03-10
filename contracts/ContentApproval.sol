// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ContentApproval
 * @dev Contract for approving AI-generated content for channels 
 * on the KnowScroll platform
 */
contract ContentApproval is Ownable, ReentrancyGuard {
    // ChannelNFT contract address
    address public channelNFT;
    
    // Content draft struct for storing content metadata
    struct ContentDraft {
        uint256 channelId;
        string title;
        string contentUri;      // IPFS URI for draft content
        string metadataUri;     // IPFS URI for content metadata
        uint256 proposalId;     // Reference to governance proposal that triggered this content
        uint256 startTime;      // Voting start time
        uint256 endTime;        // Voting end time
        address creator;        // AI agent address or content creator
        uint256 forVotes;       // Accumulated voting power for approval
        uint256 againstVotes;   // Accumulated voting power against approval
        bool executed;          // Whether voting has been executed
        bool approved;          // Whether content was approved
    }
    
    // Minimum voting period in seconds
    uint256 public minVotingPeriod;
    
    // Minimum percentage of total shares that must vote for a decision to be valid (in basis points, 10% = 1000)
    uint256 public quorumThreshold;
    
    // Counter for content draft IDs
    uint256 private _contentDraftIdCounter;
    
    // Mapping from contentDraftId to ContentDraft
    mapping(uint256 => ContentDraft) public contentDrafts;
    
    // Mapping from channelId to array of content draft IDs
    mapping(uint256 => uint256[]) private _channelContentDrafts;
    
    // Mapping to track user votes
    mapping(uint256 => mapping(address => bool)) private _hasVoted;
    
    // Events
    event ContentDraftCreated(
        uint256 indexed contentDraftId,
        uint256 indexed channelId,
        uint256 indexed proposalId,
        string title,
        string contentUri,
        uint256 startTime,
        uint256 endTime
    );
    event VoteCast(uint256 indexed contentDraftId, address indexed voter, bool support, uint256 weight);
    event ContentApproved(uint256 indexed contentDraftId, uint256 indexed channelId, string contentUri);
    event ContentRejected(uint256 indexed contentDraftId, uint256 indexed channelId);
    event QuorumThresholdUpdated(uint256 oldThreshold, uint256 newThreshold);
    event MinVotingPeriodUpdated(uint256 oldPeriod, uint256 newPeriod);
    
    /**
     * @dev Constructor initializes the contract with NFT contract address and approval parameters
     * @param _channelNFT Address of the ChannelNFT contract
     * @param _quorumThreshold Minimum percentage of shares that must vote
     * @param _minVotingPeriod Minimum voting period in seconds
     */
    constructor(
        address _channelNFT,
        uint256 _quorumThreshold,
        uint256 _minVotingPeriod
    ) Ownable(msg.sender) {
        require(_channelNFT != address(0), "ContentApproval: zero address for channelNFT");
        require(_quorumThreshold <= 5000, "ContentApproval: threshold too high"); // Max 50%
        require(_minVotingPeriod >= 1 hours, "ContentApproval: voting period too short");
        
        channelNFT = _channelNFT;
        quorumThreshold = _quorumThreshold;
        minVotingPeriod = _minVotingPeriod;
        _contentDraftIdCounter = 1; // Start from ID 1
    }
    
    /**
     * @dev Create a new content draft for approval
     * @param channelId ID of the channel
     * @param title Title of the content
     * @param contentUri IPFS URI for content draft
     * @param metadataUri IPFS URI for content metadata
     * @param proposalId ID of the original governance proposal
     * @param votingPeriod Voting period in seconds
     */
    function createContentDraft(
        uint256 channelId,
        string memory title,
        string memory contentUri,
        string memory metadataUri,
        uint256 proposalId,
        uint256 votingPeriod
    ) external returns (uint256) {
        require(bytes(title).length > 0, "ContentApproval: empty title");
        require(bytes(contentUri).length > 0, "ContentApproval: empty contentUri");
        require(votingPeriod >= minVotingPeriod, "ContentApproval: voting period too short");
        
        uint256 contentDraftId = _contentDraftIdCounter++;
        
        ContentDraft storage newContentDraft = contentDrafts[contentDraftId];
        newContentDraft.channelId = channelId;
        newContentDraft.title = title;
        newContentDraft.contentUri = contentUri;
        newContentDraft.metadataUri = metadataUri;
        newContentDraft.proposalId = proposalId;
        newContentDraft.startTime = block.timestamp;
        newContentDraft.endTime = block.timestamp + votingPeriod;
        newContentDraft.creator = msg.sender;
        newContentDraft.executed = false;
        newContentDraft.approved = false;
        
        // Add to channel content drafts
        _channelContentDrafts[channelId].push(contentDraftId);
        
        emit ContentDraftCreated(
            contentDraftId,
            channelId,
            proposalId,
            title,
            contentUri,
            newContentDraft.startTime,
            newContentDraft.endTime
        );
        
        return contentDraftId;
    }
    
    /**
     * @dev Cast a vote on a content draft
     * @param contentDraftId ID of the content draft
     * @param support Whether to support approval
     */
    function castVote(uint256 contentDraftId, bool support) external nonReentrant {
        require(contentDraftId < _contentDraftIdCounter, "ContentApproval: nonexistent content draft");
        ContentDraft storage contentDraft = contentDrafts[contentDraftId];
        
        require(block.timestamp >= contentDraft.startTime, "ContentApproval: voting not started");
        require(block.timestamp <= contentDraft.endTime, "ContentApproval: voting ended");
        require(!_hasVoted[contentDraftId][msg.sender], "ContentApproval: already voted");
        
        // Get voter's share balance
        uint256 shares = IERC1155(channelNFT).balanceOf(msg.sender, contentDraft.channelId);
        require(shares > 0, "ContentApproval: no shares owned");
        
        // Record vote
        _hasVoted[contentDraftId][msg.sender] = true;
        
        if (support) {
            contentDraft.forVotes += shares;
        } else {
            contentDraft.againstVotes += shares;
        }
        
        emit VoteCast(contentDraftId, msg.sender, support, shares);
    }
    
    /**
     * @dev Execute a content draft approval after voting ends
     * @param contentDraftId ID of the content draft
     */
    function executeContentApproval(uint256 contentDraftId) external nonReentrant {
        require(contentDraftId < _contentDraftIdCounter, "ContentApproval: nonexistent content draft");
        ContentDraft storage contentDraft = contentDrafts[contentDraftId];
        
        require(!contentDraft.executed, "ContentApproval: already executed");
        require(block.timestamp > contentDraft.endTime, "ContentApproval: voting not ended");
        
        contentDraft.executed = true;
        
        // Get total shares for the channel
        uint256 totalShares = getTotalShares(contentDraft.channelId);
        
        // Calculate total votes
        uint256 totalVotes = contentDraft.forVotes + contentDraft.againstVotes;
        
        // Check if quorum was reached
        require(totalVotes * 10000 / totalShares >= quorumThreshold, "ContentApproval: quorum not reached");
        
        // Determine if content is approved
        if (contentDraft.forVotes > contentDraft.againstVotes) {
            contentDraft.approved = true;
            emit ContentApproved(contentDraftId, contentDraft.channelId, contentDraft.contentUri);
        } else {
            contentDraft.approved = false;
            emit ContentRejected(contentDraftId, contentDraft.channelId);
        }
    }
    
    /**
     * @dev Get content drafts for a channel
     * @param channelId ID of the channel
     */
    function getChannelContentDrafts(uint256 channelId) external view returns (uint256[] memory) {
        return _channelContentDrafts[channelId];
    }
    
    /**
     * @dev Get content draft details
     * @param contentDraftId ID of the content draft
     */
    function getContentDraft(uint256 contentDraftId) external view returns (
        uint256 channelId,
        string memory title,
        string memory contentUri,
        string memory metadataUri,
        uint256 proposalId,
        uint256 startTime,
        uint256 endTime,
        address creator,
        uint256 forVotes,
        uint256 againstVotes,
        bool executed,
        bool approved
    ) {
        require(contentDraftId < _contentDraftIdCounter, "ContentApproval: nonexistent content draft");
        ContentDraft storage contentDraft = contentDrafts[contentDraftId];
        
        return (
            contentDraft.channelId,
            contentDraft.title,
            contentDraft.contentUri,
            contentDraft.metadataUri,
            contentDraft.proposalId,
            contentDraft.startTime,
            contentDraft.endTime,
            contentDraft.creator,
            contentDraft.forVotes,
            contentDraft.againstVotes,
            contentDraft.executed,
            contentDraft.approved
        );
    }
    
    /**
     * @dev Check if an address has voted on a content draft
     * @param contentDraftId ID of the content draft
     * @param voter Address of the voter
     */
    function hasVoted(uint256 contentDraftId, address voter) external view returns (bool) {
        require(contentDraftId < _contentDraftIdCounter, "ContentApproval: nonexistent content draft");
        return _hasVoted[contentDraftId][voter];
    }
    
    /**
     * @dev Get total shares for a channel (helper function)
     * @param channelId ID of the channel
     */
    function getTotalShares(uint256 channelId) public view returns (uint256) {
        // Call the getTotalShares function on the ChannelNFT contract
        // This assumes the ChannelNFT contract has this function
        // You may need to adjust this based on your actual contract interface
        (bool success, bytes memory data) = channelNFT.staticcall(
            abi.encodeWithSignature("getTotalShares(uint256)", channelId)
        );
        
        if (success && data.length >= 32) {
            return abi.decode(data, (uint256));
        }
        
        return 0; // Return 0 if call fails
    }
    
    /**
     * @dev Set the quorum threshold
     * @param _quorumThreshold New quorum threshold
     */
    function setQuorumThreshold(uint256 _quorumThreshold) external onlyOwner {
        require(_quorumThreshold <= 5000, "ContentApproval: threshold too high"); // Max 50%
        
        uint256 oldThreshold = quorumThreshold;
        quorumThreshold = _quorumThreshold;
        
        emit QuorumThresholdUpdated(oldThreshold, _quorumThreshold);
    }
    
    /**
     * @dev Set the minimum voting period
     * @param _minVotingPeriod New minimum voting period
     */
    function setMinVotingPeriod(uint256 _minVotingPeriod) external onlyOwner {
        require(_minVotingPeriod >= 1 hours, "ContentApproval: voting period too short");
        
        uint256 oldPeriod = minVotingPeriod;
        minVotingPeriod = _minVotingPeriod;
        
        emit MinVotingPeriodUpdated(oldPeriod, _minVotingPeriod);
    }
    
    /**
     * @dev Get the total number of content drafts
     */
    function getTotalContentDrafts() external view returns (uint256) {
        return _contentDraftIdCounter - 1;
    }
}