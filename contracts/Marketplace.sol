// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Marketplace
 * @dev Contract for listing and trading channel shares on the KnowScroll platform
 */
contract Marketplace is ERC1155Holder, Ownable, ReentrancyGuard {
    // NFT contract address
    address public channelNFT;
    
    // Marketplace fee percentage (in basis points, 1% = 100)
    uint256 public marketplaceFeePercentage;
    
    // Marketplace fee recipient
    address public feeRecipient;
    
    // Listing struct to store listing information
    struct Listing {
        address seller;
        uint256 channelId;
        uint256 amount;
        uint256 pricePerShare;
        uint256 listedAt;
        bool active;
    }
    
    // Counter for listing IDs
    uint256 private _listingIdCounter;
    
    // Mapping from listingId to Listing
    mapping(uint256 => Listing) public listings;
    
    // Mapping from seller to their active listing IDs
    mapping(address => uint256[]) private _sellerListings;
    
    // Events
    event ListingCreated(uint256 indexed listingId, address indexed seller, uint256 indexed channelId, uint256 amount, uint256 pricePerShare);
    event ListingUpdated(uint256 indexed listingId, uint256 newAmount, uint256 newPricePerShare);
    event ListingCancelled(uint256 indexed listingId);
    event SharesPurchased(uint256 indexed listingId, address indexed buyer, uint256 amount, uint256 totalPrice);
    event MarketplaceFeeUpdated(uint256 oldFee, uint256 newFee);
    event FeeRecipientUpdated(address oldRecipient, address newRecipient);
    
    /**
     * @dev Constructor initializes the contract with NFT contract address and marketplace fee
     * @param _channelNFT Address of the ChannelNFT contract
     * @param _marketplaceFeePercentage Marketplace fee percentage in basis points
     * @param _feeRecipient Address to receive marketplace fees
     */
    constructor(
        address _channelNFT,
        uint256 _marketplaceFeePercentage,
        address _feeRecipient
    ) Ownable(msg.sender) {
        require(_channelNFT != address(0), "Marketplace: zero address for channelNFT");
        require(_feeRecipient != address(0), "Marketplace: zero address for fee recipient");
        require(_marketplaceFeePercentage <= 1000, "Marketplace: fee too high"); // Max 10%
        
        channelNFT = _channelNFT;
        marketplaceFeePercentage = _marketplaceFeePercentage;
        feeRecipient = _feeRecipient;
        _listingIdCounter = 1; // Start from ID 1
    }
    
    /**
     * @dev Create a new listing to sell channel shares
     * @param channelId ID of the channel
     * @param amount Amount of shares to sell
     * @param pricePerShare Price per share in wei
     */
    function createListing(
        uint256 channelId,
        uint256 amount,
        uint256 pricePerShare
    ) external nonReentrant returns (uint256) {
        require(amount > 0, "Marketplace: amount must be greater than 0");
        require(pricePerShare > 0, "Marketplace: price must be greater than 0");
        
        // Check that seller owns enough shares
        uint256 sharesOwned = IERC1155(channelNFT).balanceOf(msg.sender, channelId);
        require(sharesOwned >= amount, "Marketplace: not enough shares owned");
        
        // Transfer shares to marketplace
        IERC1155(channelNFT).safeTransferFrom(msg.sender, address(this), channelId, amount, "");
        
        uint256 listingId = _listingIdCounter++;
        
        listings[listingId] = Listing({
            seller: msg.sender,
            channelId: channelId,
            amount: amount,
            pricePerShare: pricePerShare,
            listedAt: block.timestamp,
            active: true
        });
        
        _sellerListings[msg.sender].push(listingId);
        
        emit ListingCreated(listingId, msg.sender, channelId, amount, pricePerShare);
        
        return listingId;
    }
    
    /**
     * @dev Update an existing listing
     * @param listingId ID of the listing
     * @param newAmount New amount of shares (0 to keep current)
     * @param newPricePerShare New price per share (0 to keep current)
     */
    function updateListing(
        uint256 listingId,
        uint256 newAmount,
        uint256 newPricePerShare
    ) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Marketplace: not the seller");
        require(listing.active, "Marketplace: listing not active");
        
        if (newAmount > 0 && newAmount != listing.amount) {
            if (newAmount > listing.amount) {
                // Transfer additional shares to marketplace
                uint256 additionalAmount = newAmount - listing.amount;
                IERC1155(channelNFT).safeTransferFrom(msg.sender, address(this), listing.channelId, additionalAmount, "");
            } else {
                // Return excess shares to seller
                uint256 excessAmount = listing.amount - newAmount;
                IERC1155(channelNFT).safeTransferFrom(address(this), msg.sender, listing.channelId, excessAmount, "");
            }
            
            listing.amount = newAmount;
        }
        
        if (newPricePerShare > 0 && newPricePerShare != listing.pricePerShare) {
            listing.pricePerShare = newPricePerShare;
        }
        
        emit ListingUpdated(listingId, listing.amount, listing.pricePerShare);
    }
    
    /**
     * @dev Cancel a listing and return shares to seller
     * @param listingId ID of the listing
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender || owner() == msg.sender, "Marketplace: not seller or owner");
        require(listing.active, "Marketplace: listing not active");
        
        listing.active = false;
        
        // Return shares to seller
        IERC1155(channelNFT).safeTransferFrom(address(this), listing.seller, listing.channelId, listing.amount, "");
        
        emit ListingCancelled(listingId);
    }
    
    /**
     * @dev Purchase shares from a listing
     * @param listingId ID of the listing
     * @param amount Amount of shares to purchase
     */
    function purchaseShares(uint256 listingId, uint256 amount) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.active, "Marketplace: listing not active");
        require(amount > 0 && amount <= listing.amount, "Marketplace: invalid amount");
        
        uint256 totalPrice = amount * listing.pricePerShare;
        require(msg.value >= totalPrice, "Marketplace: insufficient payment");
        
        // Calculate marketplace fee
        uint256 marketplaceFee = (totalPrice * marketplaceFeePercentage) / 10000;
        uint256 sellerProceeds = totalPrice - marketplaceFee;
        
        // Update listing
        listing.amount -= amount;
        if (listing.amount == 0) {
            listing.active = false;
        }
        
        // Transfer shares to buyer
        IERC1155(channelNFT).safeTransferFrom(address(this), msg.sender, listing.channelId, amount, "");
        
        // Transfer marketplace fee
        (bool feeSuccess, ) = feeRecipient.call{value: marketplaceFee}("");
        require(feeSuccess, "Marketplace: fee transfer failed");
        
        // Transfer proceeds to seller
        (bool sellerSuccess, ) = listing.seller.call{value: sellerProceeds}("");
        require(sellerSuccess, "Marketplace: seller transfer failed");
        
        // Refund excess payment
        if (msg.value > totalPrice) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - totalPrice}("");
            require(refundSuccess, "Marketplace: refund failed");
        }
        
        emit SharesPurchased(listingId, msg.sender, amount, totalPrice);
    }
    
    /**
     * @dev Get listings by seller
     * @param seller Address of the seller
     */
    function getListingsBySeller(address seller) external view returns (uint256[] memory) {
        return _sellerListings[seller];
    }
    
    /**
     * @dev Get listing details
     * @param listingId ID of the listing
     */
    function getListing(uint256 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }
    
    /**
     * @dev Set the marketplace fee percentage
     * @param _marketplaceFeePercentage New marketplace fee percentage
     */
    function setMarketplaceFeePercentage(uint256 _marketplaceFeePercentage) external onlyOwner {
        require(_marketplaceFeePercentage <= 1000, "Marketplace: fee too high"); // Max 10%
        
        uint256 oldFee = marketplaceFeePercentage;
        marketplaceFeePercentage = _marketplaceFeePercentage;
        
        emit MarketplaceFeeUpdated(oldFee, _marketplaceFeePercentage);
    }
    
    /**
     * @dev Set the fee recipient
     * @param _feeRecipient New fee recipient
     */
    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        require(_feeRecipient != address(0), "Marketplace: zero address");
        
        address oldRecipient = feeRecipient;
        feeRecipient = _feeRecipient;
        
        emit FeeRecipientUpdated(oldRecipient, _feeRecipient);
    }
    
    /**
     * @dev Get total listings count
     */
    function getTotalListingsCount() external view returns (uint256) {
        return _listingIdCounter - 1;
    }
}