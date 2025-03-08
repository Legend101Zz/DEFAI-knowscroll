/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useMarketplace, useChannelNFT } from '@/hooks/useContract';
import { useWallet } from '@/context/WalletContext';
import Link from 'next/link';

interface MarketplaceListingsProps {
    selectedChannelId?: number;
    refresh?: number; // A counter that can be incremented to trigger a refresh
}

type Listing = {
    id: number;
    seller: string;
    channelId: number;
    channelName?: string;
    amount: number;
    pricePerShare: string;
    listedAt: Date;
    active: boolean;
};

export default function MarketplaceListings({ selectedChannelId, refresh = 0 }: MarketplaceListingsProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { account, isConnected } = useWallet();
    const { contract: marketplace } = useMarketplace();
    const { contract: channelNFT } = useChannelNFT();

    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [purchaseAmount, setPurchaseAmount] = useState<Record<number, number>>({});
    const [processingListing, setProcessingListing] = useState<number | null>(null);

    useEffect(() => {
        async function loadListings() {
            if (!marketplace) return;

            try {
                setLoading(true);
                setError(null);

                // Get total listings count
                const total = await marketplace.getTotalListingsCount();
                const listingsArray: Listing[] = [];

                // Loop through all listings
                for (let i = 1; i <= total; i++) {
                    try {
                        const listing = await marketplace.getListing(i);

                        // Only show active listings
                        if (listing.active) {
                            const newListing = {
                                id: i,
                                seller: listing.seller,
                                channelId: parseInt(listing.channelId.toString()),
                                amount: parseInt(listing.amount.toString()),
                                pricePerShare: ethers.utils.formatEther(listing.pricePerShare),
                                listedAt: new Date(listing.listedAt.toNumber() * 1000),
                                active: listing.active
                            };

                            // Filter by channelId if provided
                            if (!selectedChannelId || newListing.channelId === selectedChannelId) {
                                listingsArray.push(newListing);

                                // Initialize purchase amount to 1
                                setPurchaseAmount(prev => ({ ...prev, [i]: 1 }));
                            }
                        }
                    } catch (err) {
                        console.error(`Error loading listing ${i}:`, err);
                    }
                }

                // Get channel names for listings
                if (channelNFT) {
                    for (const listing of listingsArray) {
                        try {
                            const channel = await channelNFT.getChannel(listing.channelId);
                            listing.channelName = channel.name;
                        } catch (err) {
                            console.error(`Error loading channel name for listing ${listing.id}:`, err);
                        }
                    }
                }

                setListings(listingsArray);
            } catch (err: any) {
                setError(err.message || 'Error loading listings.');
            } finally {
                setLoading(false);
            }
        }

        loadListings();
    }, [marketplace, channelNFT, selectedChannelId, refresh]);

    const handlePurchase = async (listingId: number) => {
        if (!marketplace || !isConnected) return;

        const listing = listings.find(l => l.id === listingId);
        if (!listing) return;

        const amount = purchaseAmount[listingId] || 1;

        try {
            setProcessingListing(listingId);

            // Calculate total price
            const totalPrice = parseFloat(listing.pricePerShare) * amount;
            const totalPriceWei = ethers.utils.parseEther(totalPrice.toString());

            // Purchase shares
            const tx = await marketplace.purchaseShares(listingId, amount, {
                value: totalPriceWei
            });

            await tx.wait();

            // Update listings
            setListings(prev =>
                prev.map(l => {
                    if (l.id === listingId) {
                        const newAmount = l.amount - amount;
                        return {
                            ...l,
                            amount: newAmount,
                            active: newAmount > 0
                        };
                    }
                    return l;
                }).filter(l => l.active)
            );
        } catch (err: any) {
            console.error('Error purchasing shares:', err);
            alert(`Error purchasing shares: ${err.message}`);
        } finally {
            setProcessingListing(null);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center bg-white rounded-lg shadow">
                <p className="text-gray-500">Loading marketplace listings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center bg-red-50 rounded-lg shadow">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (listings.length === 0) {
        return (
            <div className="p-8 text-center bg-white rounded-lg shadow">
                <p className="text-gray-500">No active listings found.</p>
                {selectedChannelId && (
                    <p className="mt-4">
                        <Link
                            href="/marketplace"
                            className="text-blue-600 hover:underline"
                        >
                            View all listings
                        </Link>
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {listings.map(listing => (
                <div key={listing.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex flex-col md:flex-row justify-between">
                        <div>
                            <div className="flex items-center mb-2">
                                <h3 className="text-lg font-bold">
                                    {listing.channelName || `Channel #${listing.channelId}`}
                                </h3>
                                <Link
                                    href={`/channels/${listing.channelId}`}
                                    className="ml-2 text-xs text-blue-600 hover:underline"
                                >
                                    View Channel
                                </Link>
                            </div>

                            <p className="text-sm text-gray-600 mb-2">
                                {listing.amount} shares available at {listing.pricePerShare} ETH each
                            </p>

                            <p className="text-xs text-gray-500">
                                Listed by {listing.seller.substring(0, 6)}...{listing.seller.substring(listing.seller.length - 4)} on {listing.listedAt.toLocaleDateString()}
                            </p>
                        </div>

                        {isConnected && (
                            <div className="mt-4 md:mt-0 flex items-end">
                                <div className="mr-2">
                                    <label className="block text-xs text-gray-500 mb-1">
                                        Quantity
                                    </label>
                                    <select
                                        value={purchaseAmount[listing.id] || 1}
                                        onChange={(e) => setPurchaseAmount(prev => ({
                                            ...prev,
                                            [listing.id]: parseInt(e.target.value)
                                        }))}
                                        className="px-2 py-1 border border-gray-300 rounded"
                                        disabled={processingListing === listing.id}
                                    >
                                        {[...Array(Math.min(10, listing.amount))].map((_, i) => (
                                            <option key={i} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={() => handlePurchase(listing.id)}
                                    disabled={processingListing === listing.id}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                                >
                                    {processingListing === listing.id ? 'Processing...' : 'Buy Now'}
                                </button>
                            </div>
                        )}
                    </div>

                    {isConnected && (
                        <div className="mt-4 p-2 bg-blue-50 rounded text-sm">
                            <p className="font-medium">Total: {(parseFloat(listing.pricePerShare) * (purchaseAmount[listing.id] || 1)).toFixed(6)} ETH</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}