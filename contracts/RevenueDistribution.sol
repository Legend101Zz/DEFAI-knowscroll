// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title RevenueDistribution
 * @dev Contract for distributing revenue to channel owners
 * based on their fractional ownership
 */
contract RevenueDistribution is Ownable {
    using SafeERC20 for IERC20;
    
    // Channel NFT contract address
    address public channelNFT;
    
    // Platform fee percentage (in basis points, 1% = 100)
    uint256 public platformFeePercentage;
    
    // Platform fee recipient
    address public platformFeeRecipient;
    
    // Mapping from channelId to accumulated revenue for that channel
    mapping(uint256 => uint256) public channelRevenue;
    
    // Mapping from channelId to mapping from shareHolder to claimed revenue
    mapping(uint256 => mapping(address => uint256)) public claimedRevenue;
    
    // Events
    event RevenueAdded(uint256 indexed channelId, uint256 amount);
    event RevenueClaimed(uint256 indexed channelId, address indexed claimer, uint256 amount);
    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);
    event PlatformFeeRecipientUpdated(address oldRecipient, address newRecipient);
    event ChannelNFTUpdated(address oldAddress, address newAddress);
    
    /**
     * @dev Constructor initializes the contract with NFT contract address and platform fee
     * @param _channelNFT Address of the ChannelNFT contract
     * @param _platformFeePercentage Platform fee percentage in basis points
     * @param _platformFeeRecipient Address to receive platform fees
     */
    constructor(
        address _channelNFT,
        uint256 _platformFeePercentage,
        address _platformFeeRecipient
    ) Ownable(msg.sender) {
        require(_channelNFT != address(0), "RevenueDistribution: zero address for channelNFT");
        require(_platformFeeRecipient != address(0), "RevenueDistribution: zero address for fee recipient");
        require(_platformFeePercentage <= 5000, "RevenueDistribution: fee too high"); // Max 50%
        
        channelNFT = _channelNFT;
        platformFeePercentage = _platformFeePercentage;
        platformFeeRecipient = _platformFeeRecipient;
    }
    
    /**
     * @dev Add revenue for a specific channel (native token)
     * @param channelId ID of the channel
     */
    function addRevenue(uint256 channelId) external payable {
        require(msg.value > 0, "RevenueDistribution: zero value");
        
        // Calculate platform fee
        uint256 platformFee = (msg.value * platformFeePercentage) / 10000;
        uint256 channelAmount = msg.value - platformFee;
        
        // Transfer platform fee
        (bool success, ) = platformFeeRecipient.call{value: platformFee}("");
        require(success, "RevenueDistribution: platform fee transfer failed");
        
        // Add remaining amount to channel revenue
        channelRevenue[channelId] += channelAmount;
        
        emit RevenueAdded(channelId, channelAmount);
    }
    
    /**
     * @dev Add ERC20 token revenue for a specific channel
     * @param channelId ID of the channel
     * @param token Address of the ERC20 token
     * @param amount Amount of tokens to add as revenue
     */
    function addTokenRevenue(uint256 channelId, address token, uint256 amount) external {
        require(token != address(0), "RevenueDistribution: zero token address");
        require(amount > 0, "RevenueDistribution: zero amount");
        
        // Transfer tokens from sender to this contract
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        
        // Calculate platform fee
        uint256 platformFee = (amount * platformFeePercentage) / 10000;
        uint256 channelAmount = amount - platformFee;
        
        // Transfer platform fee
        if (platformFee > 0) {
            IERC20(token).safeTransfer(platformFeeRecipient, platformFee);
        }
        
        // Add remaining amount to channel revenue
        // Note: In a production setting, we would use a mapping for each token type
        channelRevenue[channelId] += channelAmount;
        
        emit RevenueAdded(channelId, channelAmount);
    }
    
    /**
     * @dev Claim revenue for a specific channel
     * @param channelId ID of the channel
     */
    function claimRevenue(uint256 channelId) external {
        address shareholder = msg.sender;
        uint256 shares = IERC1155(channelNFT).balanceOf(shareholder, channelId);
        require(shares > 0, "RevenueDistribution: no shares owned");
        
        uint256 totalShares = getTotalShares(channelId);
        require(totalShares > 0, "RevenueDistribution: no total shares");
        
        uint256 totalRevenue = channelRevenue[channelId];
        uint256 alreadyClaimed = claimedRevenue[channelId][shareholder];
        
        // Calculate claimable amount based on ownership percentage
        uint256 totalClaimable = (totalRevenue * shares) / totalShares;
        uint256 newlyClaimable = totalClaimable - alreadyClaimed;
        
        require(newlyClaimable > 0, "RevenueDistribution: nothing to claim");
        
        // Update claimed amount
        claimedRevenue[channelId][shareholder] = totalClaimable;
        
        // Transfer the revenue
        (bool success, ) = shareholder.call{value: newlyClaimable}("");
        require(success, "RevenueDistribution: transfer failed");
        
        emit RevenueClaimed(channelId, shareholder, newlyClaimable);
    }
    
    /**
     * @dev Get claimable revenue for a shareholder
     * @param channelId ID of the channel
     * @param shareholder Address of the shareholder
     */
    function getClaimableRevenue(uint256 channelId, address shareholder) public view returns (uint256) {
        uint256 shares = IERC1155(channelNFT).balanceOf(shareholder, channelId);
        if (shares == 0) return 0;
        
        uint256 totalShares = getTotalShares(channelId);
        if (totalShares == 0) return 0;
        
        uint256 totalRevenue = channelRevenue[channelId];
        uint256 alreadyClaimed = claimedRevenue[channelId][shareholder];
        
        uint256 totalClaimable = (totalRevenue * shares) / totalShares;
        uint256 newlyClaimable = totalClaimable > alreadyClaimed ? totalClaimable - alreadyClaimed : 0;
        
        return newlyClaimable;
    }
    
    /**
     * @dev Get total shares for a channel (helper function)
     * @param channelId ID of the channel
     */
    function getTotalShares(uint256 channelId) public view returns (uint256) {
        // This is a simplified approach. In production, you would get this from ChannelNFT contract
        // Note: For this implementation, we're assuming the total shares value is stored in the Channel struct
        
        // Call the ChannelNFT contract to get channel info
        (bool success, bytes memory data) = channelNFT.staticcall(
            abi.encodeWithSignature("getChannel(uint256)", channelId)
        );
        
        require(success, "RevenueDistribution: failed to get channel info");
        
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
     * @dev Set the platform fee percentage
     * @param _platformFeePercentage New platform fee percentage
     */
    function setPlatformFeePercentage(uint256 _platformFeePercentage) external onlyOwner {
        require(_platformFeePercentage <= 5000, "RevenueDistribution: fee too high"); // Max 50%
        
        uint256 oldFee = platformFeePercentage;
        platformFeePercentage = _platformFeePercentage;
        
        emit PlatformFeeUpdated(oldFee, _platformFeePercentage);
    }
    
    /**
     * @dev Set the platform fee recipient
     * @param _platformFeeRecipient New platform fee recipient
     */
    function setPlatformFeeRecipient(address _platformFeeRecipient) external onlyOwner {
        require(_platformFeeRecipient != address(0), "RevenueDistribution: zero address");
        
        address oldRecipient = platformFeeRecipient;
        platformFeeRecipient = _platformFeeRecipient;
        
        emit PlatformFeeRecipientUpdated(oldRecipient, _platformFeeRecipient);
    }
    
    /**
     * @dev Set the ChannelNFT contract address
     * @param _channelNFT New ChannelNFT address
     */
    function setChannelNFT(address _channelNFT) external onlyOwner {
        require(_channelNFT != address(0), "RevenueDistribution: zero address");
        
        address oldAddress = channelNFT;
        channelNFT = _channelNFT;
        
        emit ChannelNFTUpdated(oldAddress, _channelNFT);
    }
    
    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
}