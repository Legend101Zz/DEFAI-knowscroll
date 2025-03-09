"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '@/context/WalletContext';
import { useMarketplace, useChannelNFT } from '@/hooks/useContract';
import Link from 'next/link';

interface Listing {
    id: number;
    seller: string;
    channelId: number;
    amount: number;
    pricePerShare: string;
    totalPrice: string;
    listedAt: Date;
    active: boolean;
    channelName?: string;
    channelCategory?: string;
}

interface MarketplaceListingsProps {
    selectedChannelId?: number;
    refresh?: number;
}

export default function MarketplaceListings({ selectedChannelId, refresh = 0 }: MarketplaceListingsProps) {
    const { isConnected, account } = useWallet();
    const { contract: marketplace, loading: loadingMarketplace } = useMarketplace();
    const { contract: channelNFT, loading: loadingChannelNFT } = useChannelNFT();

    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchaseState, setPurchaseState] = useState<{
        listingId: number | null;
        amount: number;
        processing: boolean;
    }>({
        listingId: null,
        amount: 1,
        processing: false
    });

    const [filter, setFilter] = useState<'all' | 'lowest' | 'newest'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Handle purchase amount change
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, maxAmount: number) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            setPurchaseState({ ...purchaseState, amount: 1 });
        } else if (value > maxAmount) {
            setPurchaseState({ ...purchaseState, amount: maxAmount });
        } else {
            setPurchaseState({ ...purchaseState, amount: value });
        }
    };

    // Handle purchase submission
    const handlePurchase = async (listingId: number, amount: number, pricePerShare: string) => {
        if (!marketplace || !isConnected) return;

        try {
            setPurchaseState({ ...purchaseState, processing: true });

            // Calculate total price
            const totalPrice = ethers.utils.parseEther(pricePerShare).mul(amount);

            // Execute purchase transaction
            const tx = await marketplace.purchaseShares(listingId, amount, {
                value: totalPrice
            });

            await tx.wait();

            // Reset purchase state and refresh listings
            setPurchaseState({
                listingId: null,
                amount: 1,
                processing: false
            });

            // Remove purchased listing from the state
            setListings(prevListings =>
                prevListings.map(listing =>
                    listing.id === listingId
                        ? {
                            ...listing,
                            amount: listing.amount - amount,
                            active: listing.amount - amount > 0
                        }
                        : listing
                ).filter(listing => listing.active)
            );

        } catch (error) {
            console.error("Error purchasing shares:", error);
            setPurchaseState({ ...purchaseState, processing: false });
        }
    };

    // Format address for display
    const formatAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    // Fetch listings from the marketplace contract
    useEffect(() => {
        const fetchListings = async () => {
            if (!marketplace || !channelNFT) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log("Fetching marketplace listings...");

                // Get total number of listings
                const totalListingsData = await marketplace.getTotalListingsCount();
                const totalListings = Number(totalListingsData.toString());
                console.log(`Total listings: ${totalListings}`);

                if (totalListings === 0) {
                    setListings([]);
                    setLoading(false);
                    return;
                }

                const fetchedListings: Listing[] = [];

                // Process each listing
                for (let i = 1; i <= totalListings; i++) {
                    try {
                        const listingData = await marketplace.getListing(i);

                        // Only add active listings
                        if (listingData.active) {
                            const channelId = Number(listingData.channelId.toString());

                            // Skip if filtering by channel and this doesn't match
                            if (selectedChannelId && channelId !== selectedChannelId) {
                                continue;
                            }

                            // Format price as ETH
                            const pricePerShare = ethers.utils.formatEther(listingData.pricePerShare);
                            const totalPrice = ethers.utils.formatEther(
                                listingData.pricePerShare.mul(listingData.amount)
                            );

                            // Create listing object
                            const listing: Listing = {
                                id: i,
                                seller: listingData.seller,
                                channelId,
                                amount: Number(listingData.amount.toString()),
                                pricePerShare,
                                totalPrice,
                                listedAt: new Date(Number(listingData.listedAt.toString()) * 1000),
                                active: listingData.active
                            };

                            // Fetch channel name and category
                            try {
                                const channelData = await channelNFT.getChannel(channelId);
                                listing.channelName = channelData.name;
                                listing.channelCategory = channelData.category;
                            } catch (channelError) {
                                console.error(`Error fetching channel ${channelId}:`, channelError);
                                listing.channelName = `Channel #${channelId}`;
                            }

                            fetchedListings.push(listing);
                        }
                    } catch (error) {
                        console.error(`Error processing listing ${i}:`, error);
                    }
                }

                console.log(`Found ${fetchedListings.length} active listings`);
                setListings(fetchedListings);

            } catch (error) {
                console.error("Error fetching listings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [marketplace, channelNFT, selectedChannelId, refresh]);

    // Filter and sort listings
    const filteredListings = listings.filter(listing => {
        // If we have a search query, filter by channel name
        if (searchQuery) {
            return listing.channelName?.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });

    const sortedListings = [...filteredListings].sort((a, b) => {
        if (filter === 'lowest') {
            return parseFloat(a.pricePerShare) - parseFloat(b.pricePerShare);
        } else if (filter === 'newest') {
            return b.listedAt.getTime() - a.listedAt.getTime();
        }
        return 0;
    });

    // Empty state component
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-16 bg-[#121218]/30 rounded-xl border border-white/5">
            <svg className="w-16 h-16 text-white/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">No Listings Found</h3>
            <p className="text-white/70 text-center max-w-md mb-6">
                {selectedChannelId
                    ? `There are currently no listings for Channel #${selectedChannelId}.`
                    : 'There are currently no active listings in the marketplace.'
                }
            </p>

            {isConnected ? (
                selectedChannelId ? (
                    <Link
                        href="/channels"
                        className="px-6 py-2 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-full font-medium hover:shadow-glow transition-all"
                    >
                        Browse Other Channels
                    </Link>
                ) : (
                    <Link
                        href="/channels"
                        className="px-6 py-2 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-full font-medium hover:shadow-glow transition-all"
                    >
                        Find Channels to Trade
                    </Link>
                )
            ) : (
                <p className="text-white/70">Connect your wallet to trade channel shares</p>
            )}
        </div>
    );

    // Loading skeleton
    const ListingSkeleton = () => (
        <div className="bg-[#121218]/80 rounded-xl overflow-hidden animate-pulse">
            <div className="h-32 bg-gradient-to-r from-[#1A1A24] to-[#121218]"></div>
            <div className="p-4">
                <div className="h-6 w-2/3 bg-[#1A1A24] rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-[#1A1A24] rounded mb-4"></div>
                <div className="flex justify-between mb-3">
                    <div className="h-5 w-20 bg-[#1A1A24] rounded"></div>
                    <div className="h-5 w-16 bg-[#1A1A24] rounded"></div>
                </div>
                <div className="h-10 bg-[#1A1A24] rounded"></div>
            </div>
        </div>
    );

    return (
        <div>
            {/* Filters and search */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div className="relative w-full md:w-auto md:min-w-[220px]">
                    <input
                        type="text"
                        placeholder="Search channels..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 pl-10 bg-[#121218] rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white"
                    />
                    <svg className="w-5 h-5 text-white/50 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <div className="relative">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as 'all' | 'lowest' | 'newest')}
                        className="appearance-none px-4 py-2 pr-10 bg-[#121218] rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white"
                    >
                        <option value="all">All Listings</option>
                        <option value="lowest">Lowest Price</option>
                        <option value="newest">Newest First</option>
                    </select>
                    <svg className="w-4 h-4 text-white/50 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {loading ? (
                // Loading state
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <ListingSkeleton key={i} />
                    ))}
                </div>
            ) : sortedListings.length > 0 ? (
                // Listings grid
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedListings.map(listing => (
                        <div key={listing.id} className="bg-[#121218]/80 border border-white/5 hover:border-white/10 rounded-xl overflow-hidden transition-all">
                            {/* Channel header */}
                            <div className="h-24 bg-gradient-to-r from-[#37E8FF]/10 to-[#FF3D8A]/10 relative p-4">
                                <div className="absolute top-3 left-3 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                                    Channel #{listing.channelId}
                                </div>

                                {listing.channelCategory && (
                                    <div className="absolute top-3 right-3 bg-[#37E8FF]/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs text-[#37E8FF]">
                                        {listing.channelCategory}
                                    </div>
                                )}

                                <div className="absolute bottom-3 left-0 w-full px-4">
                                    <Link
                                        href={`/channels/${listing.channelId}`}
                                        className="font-bold text-lg hover:text-[#37E8FF] transition-colors"
                                    >
                                        {listing.channelName || `Channel #${listing.channelId}`}
                                    </Link>
                                </div>
                            </div>

                            {/* Listing details */}
                            <div className="p-4">
                                <div className="flex justify-between mb-3">
                                    <div className="text-white/60 text-sm">Seller</div>
                                    <div className="font-medium text-sm">{formatAddress(listing.seller)}</div>
                                </div>

                                <div className="flex justify-between mb-3">
                                    <div className="text-white/60 text-sm">Available</div>
                                    <div className="font-medium">{listing.amount} shares</div>
                                </div>

                                <div className="flex justify-between mb-3">
                                    <div className="text-white/60 text-sm">Price per share</div>
                                    <div className="font-bold text-[#37E8FF]">{parseFloat(listing.pricePerShare).toFixed(6)} S</div>
                                </div>

                                <div className="flex justify-between mb-4">
                                    <div className="text-white/60 text-sm">Listed</div>
                                    <div className="font-medium text-sm">{listing.listedAt.toLocaleDateString()}</div>
                                </div>

                                {/* Purchase section */}
                                {isConnected && (
                                    purchaseState.listingId === listing.id ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <div className="text-white/60 text-sm">Amount:</div>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={listing.amount}
                                                    value={purchaseState.amount}
                                                    onChange={(e) => handleAmountChange(e, listing.amount)}
                                                    className="bg-[#1A1A24] border border-white/10 rounded px-2 py-1 w-20 text-white"
                                                />
                                                <div className="text-white/60 text-xs">
                                                    Total: {(parseFloat(listing.pricePerShare) * purchaseState.amount).toFixed(6)} S
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handlePurchase(listing.id, purchaseState.amount, listing.pricePerShare)}
                                                    disabled={purchaseState.processing}
                                                    className="flex-1 py-2 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-lg font-medium text-sm hover:shadow-glow transition-all disabled:opacity-50 flex justify-center items-center"
                                                >
                                                    {purchaseState.processing ? (
                                                        <>
                                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        'Confirm'
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => setPurchaseState({ ...purchaseState, listingId: null })}
                                                    disabled={purchaseState.processing}
                                                    className="py-2 px-3 bg-[#121218] border border-white/10 text-white rounded-lg text-sm hover:border-white/30 transition-colors disabled:opacity-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setPurchaseState({ ...purchaseState, listingId: listing.id, amount: 1 })}
                                            className="w-full py-2 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-lg font-medium text-sm hover:shadow-glow transition-all"
                                        >
                                            Buy Shares
                                        </button>
                                    )
                                )}

                                {!isConnected && (
                                    <div className="text-center py-2 bg-[#1A1A24] border border-white/10 rounded-lg text-sm text-white/60">
                                        Connect wallet to buy
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Empty state
                <EmptyState />
            )}
        </div>
    );
}