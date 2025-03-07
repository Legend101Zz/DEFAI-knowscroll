// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ChannelNFT
 * @dev Contract for fractional ownership of AI content channels 
 * on the KnowScroll platform
 */
contract ChannelNFT is ERC1155, ERC1155Supply, Ownable {
    using Strings for uint256;
    
    // Channel struct to store metadata
    struct Channel {
        string name;
        string description;
        string category;
        address creator;
        uint256 totalShares;
        uint256 createdAt;
        bool active;
    }
    
    // Mapping from channelId to Channel
    mapping(uint256 => Channel) public channels;
    
    // Counter for channel IDs
    uint256 private _channelIdCounter;
    
    // Base URI for metadata
    string private _baseURI;
    
    // Mapping from address to their created channels
    mapping(address => uint256[]) private _createdChannels;
    
    // Events
    event ChannelCreated(uint256 indexed channelId, address indexed creator, string name, uint256 totalShares);
    event SharesTransferred(uint256 indexed channelId, address indexed from, address indexed to, uint256 amount);
    event ChannelStatusChanged(uint256 indexed channelId, bool active);
    
    /**
     * @dev Constructor initializes the contract with base URI for metadata
     */
    constructor(string memory baseURI) ERC1155(baseURI) Ownable(msg.sender) {
        _baseURI = baseURI;
        _channelIdCounter = 1; // Start from ID 1
    }
    
    /**
     * @dev Create a new channel with initial shares
     * @param name Name of the channel
     * @param description Description of the channel
     * @param category Category of the channel
     * @param initialShares Total number of shares to mint
     */
    function createChannel(
        string memory name,
        string memory description,
        string memory category,
        uint256 initialShares
    ) external returns (uint256) {
        require(bytes(name).length > 0, "ChannelNFT: name cannot be empty");
        require(initialShares > 0, "ChannelNFT: initial shares must be greater than 0");
        
        uint256 channelId = _channelIdCounter++;
        
        channels[channelId] = Channel({
            name: name,
            description: description,
            category: category,
            creator: msg.sender,
            totalShares: initialShares,
            createdAt: block.timestamp,
            active: true
        });
        
        // Mint all initial shares to channel creator
        _mint(msg.sender, channelId, initialShares, "");
        
        // Add to creator's channels list
        _createdChannels[msg.sender].push(channelId);
        
        emit ChannelCreated(channelId, msg.sender, name, initialShares);
        
        return channelId;
    }
    
    /**
     * @dev Set active status of a channel
     * @param channelId ID of the channel
     * @param active New active status
     */
    function setChannelActive(uint256 channelId, bool active) external {
        require(channels[channelId].creator == msg.sender || owner() == msg.sender, "ChannelNFT: not creator or owner");
        channels[channelId].active = active;
        
        emit ChannelStatusChanged(channelId, active);
    }
    
    /**
     * @dev Get channels created by an address
     * @param creator Address of the creator
     */
    function getCreatedChannels(address creator) external view returns (uint256[] memory) {
        return _createdChannels[creator];
    }
    
    /**
     * @dev Get channel details
     * @param channelId ID of the channel
     */
    function getChannel(uint256 channelId) external view returns (Channel memory) {
        require(channelId < _channelIdCounter, "ChannelNFT: channel does not exist");
        return channels[channelId];
    }
    
    /**
     * @dev Get URI for a token
     * @param tokenId ID of the token (channelId)
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(exists(tokenId), "ChannelNFT: URI query for nonexistent token");
        
        return string(abi.encodePacked(_baseURI, tokenId.toString()));
    }
    
    /**
     * @dev Set new base URI
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) external onlyOwner {
        _baseURI = newBaseURI;
    }
    
    /**
     * @dev Get total number of channels
     */
    function getTotalChannels() external view returns (uint256) {
        return _channelIdCounter - 1;
    }
    
    // Override _update function to resolve the conflict between ERC1155 and ERC1155Supply
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values);
        
        // Emit transfer event for each channel ID
        // Moving this logic from _beforeTokenTransfer to _update as per OpenZeppelin's latest architecture
        for (uint256 i = 0; i < ids.length; i++) {
            if (from != address(0) && to != address(0)) {
                emit SharesTransferred(ids[i], from, to, values[i]);
            }
        }
    }
}