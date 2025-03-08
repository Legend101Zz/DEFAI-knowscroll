"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NavBar from '@/components/layout/NavBar';
import MarketplaceListings from '@/components/marketplace/MarketplaceListings';
import CreateListing from '@/components/marketplace/CreateListing';
import { useWallet } from '@/context/WalletContext';
import Link from 'next/link';

export default function MarketplacePage() {
    const { isConnected } = useWallet();
    const searchParams = useSearchParams();
    const channelParam = searchParams.get('channel');
    const [selectedChannelId, setSelectedChannelId] = useState<number | undefined>(
        channelParam ? parseInt(channelParam) : undefined
    );
    const [refreshCounter, setRefreshCounter] = useState<number>(0);

    // Function to refresh listings after creating a new one
    const handleListingCreated = () => {
        setRefreshCounter(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
                    <p className="text-gray-500">
                        {selectedChannelId
                            ? `Browsing listings for Channel #${selectedChannelId}`
                            : 'Browse and trade channel shares'
                        }
                    </p>
                </div>

                {selectedChannelId && (
                    <div className="mb-4">
                        <Link
                            href="/marketplace"
                            className="text-blue-600 hover:underline flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to all listings
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <MarketplaceListings
                            selectedChannelId={selectedChannelId}
                            refresh={refreshCounter}
                        />
                    </div>

                    <div>
                        {isConnected && selectedChannelId && (
                            <CreateListing
                                channelId={selectedChannelId}
                                onSuccess={handleListingCreated}
                            />
                        )}

                        {isConnected && !selectedChannelId && (
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-bold mb-4">Create a Listing</h3>
                                <p className="text-gray-600 mb-4">
                                    Select a specific channel to create a listing for its shares.
                                </p>
                                <Link
                                    href="/channels"
                                    className="block w-full py-2 px-4 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700"
                                >
                                    Browse Channels
                                </Link>
                            </div>
                        )}

                        {!isConnected && (
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-lg font-bold mb-4">Connect Wallet</h3>
                                <p className="text-gray-600 mb-4">
                                    Connect your wallet to buy shares or create listings.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}