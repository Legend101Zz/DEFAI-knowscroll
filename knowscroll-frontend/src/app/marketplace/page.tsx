"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ethers } from 'ethers';
import AppNavBar from '@/components/layout/AppNavBar';
import MarketplaceListings from '@/components/marketplace/MarketplaceListings';
import CreateListing from '@/components/marketplace/CreateListing';
import { useWallet } from '@/context/WalletContext';
import { useChannelNFT, useMarketplace } from '@/hooks/useContract';
import { TESTNET_CHAIN_ID } from '@/lib/contracts/addresses';
import Link from 'next/link';

// Background animation component to match homepage style
const BackgroundAnimation = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) - 0.5,
                y: (e.clientY / window.innerHeight) - 0.5
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[#121218]"></div>

            {/* Animated gradient blobs that react to mouse movement */}
            <div
                className="absolute transition-transform duration-500 ease-out top-0 left-1/4 w-1/2 h-1/2 bg-[#37E8FF]/10 rounded-full filter blur-[100px]"
                style={{
                    transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
                }}
            ></div>
            <div
                className="absolute transition-transform duration-500 ease-out bottom-0 right-1/4 w-1/2 h-1/2 bg-[#FF3D8A]/10 rounded-full filter blur-[100px]"
                style={{
                    transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`
                }}
            ></div>
            <div
                className="absolute transition-transform duration-500 ease-out top-1/4 right-1/4 w-1/3 h-1/3 bg-[#A742FF]/10 rounded-full filter blur-[80px]"
                style={{
                    transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`
                }}
            ></div>

            {/* Digital lines/grid effect */}
            <div className="absolute inset-0 opacity-10">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#37E8FF] to-transparent absolute" style={{ top: '20%' }}></div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#FF3D8A] to-transparent absolute" style={{ top: '40%' }}></div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#A742FF] to-transparent absolute" style={{ top: '60%' }}></div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#37E8FF] to-transparent absolute" style={{ top: '80%' }}></div>

                <div className="w-px h-full bg-gradient-to-b from-transparent via-[#37E8FF] to-transparent absolute" style={{ left: '20%' }}></div>
                <div className="w-px h-full bg-gradient-to-b from-transparent via-[#FF3D8A] to-transparent absolute" style={{ left: '40%' }}></div>
                <div className="w-px h-full bg-gradient-to-b from-transparent via-[#A742FF] to-transparent absolute" style={{ left: '60%' }}></div>
                <div className="w-px h-full bg-gradient-to-b from-transparent via-[#37E8FF] to-transparent absolute" style={{ left: '80%' }}></div>
            </div>
        </div>
    );
};

// Network Switcher Component
const NetworkSwitcher = ({
    targetChainId = TESTNET_CHAIN_ID,
    currentChainId
}: {
    targetChainId?: number;
    currentChainId: number | null;
}) => {
    const [switching, setSwitching] = useState(false);

    const switchNetwork = async () => {
        if (!window.ethereum) return;

        try {
            setSwitching(true);
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${targetChainId.toString(16)}` }],
            });
        } catch (error: any) {
            // This error code indicates that the chain has not been added to MetaMask
            if (error.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: `0x${targetChainId.toString(16)}`,
                                chainName: 'Sonic Blaze Testnet',
                                nativeCurrency: {
                                    name: 'Sonic',
                                    symbol: 'S',
                                    decimals: 18,
                                },
                                rpcUrls: ['https://rpc.blaze.soniclabs.com'],
                                blockExplorerUrls: ['https://testnet.sonicscan.org/'],
                            },
                        ],
                    });
                } catch (addError) {
                    console.error('Error adding Sonic network:', addError);
                }
            }
            console.error('Error switching to Sonic network:', error);
        } finally {
            setSwitching(false);
        }
    };

    const isOnCorrectNetwork = currentChainId === targetChainId;

    if (isOnCorrectNetwork) return null;

    return (
        <div className="fixed bottom-4 right-4 z-40">
            <div className="bg-[#1A1A24] border border-[#FF3D8A]/50 rounded-lg p-4 shadow-lg max-w-xs">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        <svg className="h-5 w-5 text-[#FF3D8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-white">Wrong Network</h3>
                        <div className="mt-1 text-xs text-white/70">
                            Please switch to the Sonic Blaze Testnet to interact with KnowScroll.
                        </div>
                        <div className="mt-2">
                            <button
                                onClick={switchNetwork}
                                disabled={switching}
                                className="text-xs inline-flex items-center py-1 px-3 bg-[#FF3D8A]/20 text-[#FF3D8A] rounded-md hover:bg-[#FF3D8A]/30 transition-colors disabled:opacity-50"
                            >
                                {switching ? (
                                    <>
                                        <svg className="animate-spin -ml-0.5 mr-1.5 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Switching...
                                    </>
                                ) : (
                                    'Switch to Sonic Blaze Testnet'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Channel Selector Component
interface Channel {
    id: number;
    name: string;
    description: string;
    category: string;
    totalShares: number;
    userShares?: number;
    userSharePercentage?: number;
}

const ChannelSelector = ({
    channels,
    onSelect,
    loading
}: {
    channels: Channel[];
    onSelect: (channelId: number) => void;
    loading: boolean;
}) => {
    const [showAll, setShowAll] = useState(false);

    const userOwnedChannels = channels.filter(c => (c.userShares || 0) > 0);
    const displayedChannels = showAll ? userOwnedChannels : userOwnedChannels.slice(0, 3);

    if (loading) {
        return (
            <div className="p-4 text-center">
                <div className="w-8 h-8 border-t-2 border-b-2 border-[#37E8FF] rounded-full animate-spin mx-auto mb-2"></div>
                <div className="text-white/70 text-sm">Loading your channels...</div>
            </div>
        );
    }

    if (userOwnedChannels.length === 0) {
        return (
            <div className="p-4 text-center">
                <p className="text-white/70 mb-4">You don't own shares in any channels yet.</p>
                <Link
                    href="/channels"
                    className="inline-flex items-center px-4 py-2 bg-[#1A1A24] border border-white/10 rounded-lg hover:border-[#37E8FF]/30 transition-all"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    Browse Channels
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {displayedChannels.map(channel => (
                <button
                    key={channel.id}
                    onClick={() => onSelect(channel.id)}
                    className="w-full flex items-center p-3 rounded-lg bg-[#121218]/80 hover:bg-[#1A1A24] transition-all border border-white/5 hover:border-[#37E8FF]/30 text-left"
                >
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#37E8FF]/20 to-[#FF3D8A]/20 flex items-center justify-center mr-3">
                        <span className="text-white/90 font-medium">#{channel.id}</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="font-medium truncate">{channel.name}</div>
                        <div className="text-xs text-white/50">You own {channel.userSharePercentage?.toFixed(2) || 0}%</div>
                    </div>
                    <div className="ml-2 text-sm bg-[#37E8FF]/20 text-[#37E8FF] rounded-full px-2 py-0.5">
                        {channel.userShares} shares
                    </div>
                </button>
            ))}

            {userOwnedChannels.length > 3 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full text-sm text-center text-white/60 hover:text-white/80 transition-colors py-2"
                >
                    {showAll ? 'Show Less' : `Show ${userOwnedChannels.length - 3} More`}
                </button>
            )}
        </div>
    );
};

export default function MarketplacePage() {
    const { isConnected, connect, account, chainId } = useWallet();
    const { contract: channelNFT, loading: loadingNFT } = useChannelNFT();
    const { contract: marketplace, loading: loadingMarketplace } = useMarketplace();

    const searchParams = useSearchParams();
    const channelParam = searchParams.get('channel');
    const [selectedChannelId, setSelectedChannelId] = useState<number | undefined>(
        channelParam ? parseInt(channelParam) : undefined
    );
    const [refreshCounter, setRefreshCounter] = useState<number>(0);

    // States for marketplace data
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loadingChannels, setLoadingChannels] = useState(true);
    const [marketStats, setMarketStats] = useState({
        totalVolume: "0",
        activeListings: "0",
        avgPrice: "0"
    });
    const [trendingCategories, setTrendingCategories] = useState<{ name: string; count: number }[]>([]);
    const [topChannels, setTopChannels] = useState<{ id: number; name: string; listingsCount: number }[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);

    // Function to refresh listings after creating a new one
    const handleListingCreated = () => {
        setRefreshCounter(prev => prev + 1);
        fetchMarketStats(); // Refresh stats after new listing
    };

    // Handle channel selection
    const handleChannelSelect = (channelId: number) => {
        setSelectedChannelId(channelId);
    };

    // Fetch user channels
    useEffect(() => {
        const fetchUserChannels = async () => {
            if (!channelNFT || !account) {
                setLoadingChannels(false);
                return;
            }

            try {
                setLoadingChannels(true);
                console.log("Fetching user channels...");

                // Get total number of channels
                const totalChannelsData = await channelNFT.getTotalChannels();
                const totalChannels = Number(totalChannelsData.toString());
                console.log(`Total channels found: ${totalChannels}`);

                if (totalChannels === 0) {
                    setChannels([]);
                    setLoadingChannels(false);
                    return;
                }

                const fetchedChannels: Channel[] = [];

                for (let i = 1; i <= totalChannels; i++) {
                    try {
                        // First check if user has shares in this channel
                        const userShares = await channelNFT.balanceOf(account, i);

                        if (Number(userShares.toString()) > 0) {
                            // User has shares, fetch channel details
                            const channelData = await channelNFT.getChannel(i);

                            const channel: Channel = {
                                id: i,
                                name: channelData.name,
                                description: channelData.description,
                                category: channelData.category,
                                totalShares: Number(channelData.totalShares.toString()),
                                userShares: Number(userShares.toString()),
                                userSharePercentage: (Number(userShares.toString()) / Number(channelData.totalShares.toString())) * 100
                            };

                            fetchedChannels.push(channel);
                        }
                    } catch (error) {
                        console.error(`Error processing channel ${i}:`, error);
                    }
                }

                console.log(`Found ${fetchedChannels.length} channels owned by user`);
                setChannels(fetchedChannels);
            } catch (error) {
                console.error("Error fetching user channels:", error);
            } finally {
                setLoadingChannels(false);
            }
        };

        fetchUserChannels();
    }, [channelNFT, account, refreshCounter]);

    // Fetch marketplace stats
    const fetchMarketStats = async () => {
        if (!marketplace) return;

        try {
            setLoadingStats(true);

            // Get total listings count
            const totalListingsData = await marketplace.getTotalListingsCount();
            const totalListings = Number(totalListingsData.toString());

            let activeListingsCount = 0;
            let totalVolumeEth = ethers.BigNumber.from(0);
            let totalPriceSum = ethers.BigNumber.from(0);
            let activePriceCount = 0;

            const categoryCount: Record<string, number> = {};
            const channelListingsCount: Record<number, number> = {};
            const channelNames: Record<number, string> = {};

            // Process each listing to gather stats
            for (let i = 1; i <= totalListings; i++) {
                try {
                    const listing = await marketplace.getListing(i);

                    // Only count active listings
                    if (listing.active) {
                        activeListingsCount++;

                        // Sum up price for average calculation
                        totalPriceSum = totalPriceSum.add(listing.pricePerShare);
                        activePriceCount++;

                        // Track listings by channel
                        const channelId = Number(listing.channelId.toString());
                        channelListingsCount[channelId] = (channelListingsCount[channelId] || 0) + 1;

                        // Fetch channel details if not already fetched
                        if (!channelNames[channelId] && channelNFT) {
                            try {
                                const channelData = await channelNFT.getChannel(channelId);
                                channelNames[channelId] = channelData.name;

                                // Count categories
                                const category = channelData.category;
                                categoryCount[category] = (categoryCount[category] || 0) + 1;
                            } catch (error) {
                                console.error(`Error fetching channel ${channelId}:`, error);
                            }
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching listing ${i}:`, error);
                }
            }

            // Calculate average price
            const avgPrice = activePriceCount > 0
                ? ethers.utils.formatEther(totalPriceSum.div(activePriceCount))
                : "0";

            // Format to 4 decimal places
            const formattedAvgPrice = Number(avgPrice).toFixed(4);

            // Find trending categories
            const trendingCats = Object.entries(categoryCount)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 4);

            // Find top channels by listings
            const topChannelsByListings = Object.entries(channelListingsCount)
                .map(([idStr, count]) => ({
                    id: parseInt(idStr),
                    name: channelNames[parseInt(idStr)] || `Channel #${idStr}`,
                    listingsCount: count
                }))
                .sort((a, b) => b.listingsCount - a.listingsCount)
                .slice(0, 3);

            setMarketStats({
                totalVolume: "0", // We don't have historical volume data in this simple implementation
                activeListings: activeListingsCount.toString(),
                avgPrice: formattedAvgPrice
            });

            setTrendingCategories(trendingCats);
            setTopChannels(topChannelsByListings);

        } catch (error) {
            console.error("Error fetching market stats:", error);
        } finally {
            setLoadingStats(false);
        }
    };

    // Fetch marketplace stats on load and when refreshCounter changes
    useEffect(() => {
        if (marketplace) {
            fetchMarketStats();
        }
    }, [marketplace, refreshCounter]);

    // Colors for categories
    const categoryColors = [
        { bg: 'bg-[#37E8FF]/10', text: 'text-[#37E8FF]' },
        { bg: 'bg-[#FF3D8A]/10', text: 'text-[#FF3D8A]' },
        { bg: 'bg-[#A742FF]/10', text: 'text-[#A742FF]' },
        { bg: 'bg-white/10', text: 'text-white/70' },
    ];

    return (
        <div className="min-h-screen bg-[#121218] text-white relative">
            <BackgroundAnimation />
            <AppNavBar />

            {/* Network Switcher */}
            {isConnected && <NetworkSwitcher currentChainId={chainId} />}

            <main className="max-w-screen-xl mx-auto px-4 py-12">
                {/* Header Section with Stats */}
                <div className="relative z-10 mb-12">
                    <div className="flex flex-col md:flex-row gap-2 mb-4">
                        <div className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-[#1A1A24]/80 backdrop-blur-sm border border-[#37E8FF]/20">
                            <div className="w-2 h-2 rounded-full bg-[#37E8FF] mr-2 animate-pulse"></div>
                            <span className="text-white/80">Sonic Blockchain Marketplace</span>
                        </div>

                        <div className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-[#FFB800]/20 backdrop-blur-sm border border-[#FFB800]/30">
                            <span className="text-[#FFB800] font-medium">TESTNET MODE</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-3">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                                    Channel Marketplace
                                </span>
                            </h1>

                            <p className="text-white/70 text-lg max-w-2xl">
                                {selectedChannelId
                                    ? `Trading shares for Channel #${selectedChannelId} — Acquire ownership and earn revenue as content grows.`
                                    : 'Discover, buy and sell channel shares. Own a piece of your favorite AI content creators.'
                                }
                            </p>
                        </div>

                        {selectedChannelId && (
                            <div>
                                <Link
                                    href="/marketplace"
                                    className="inline-flex items-center px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    All Channels
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Market Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-[#37E8FF]/30 transition-all">
                            <div className="text-white/60 text-sm mb-1">Active Listings</div>
                            <div className="flex items-end">
                                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                                    {loadingStats ? (
                                        <div className="h-8 w-20 bg-gradient-to-r from-[#1A1A24] to-[#121218] animate-pulse rounded"></div>
                                    ) : (
                                        marketStats.activeListings
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-[#FF3D8A]/30 transition-all">
                            <div className="text-white/60 text-sm mb-1">Average Price</div>
                            <div className="flex items-end">
                                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3D8A] to-[#A742FF]">
                                    {loadingStats ? (
                                        <div className="h-8 w-20 bg-gradient-to-r from-[#1A1A24] to-[#121218] animate-pulse rounded"></div>
                                    ) : (
                                        marketStats.avgPrice
                                    )}
                                </div>
                                <div className="ml-1 text-white/60 text-sm">S per share</div>
                            </div>
                        </div>

                        <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-[#A742FF]/30 transition-all">
                            <div className="text-white/60 text-sm mb-1">Testnet Network</div>
                            <div className="flex items-center">
                                <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#A742FF] to-[#37E8FF]">
                                    Sonic Blaze Testnet
                                </div>
                                <div className="ml-2 h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        {/* Marketplace Listings */}
                        <div className="bg-[#1A1A24]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-6 flex items-center">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                                    {selectedChannelId
                                        ? `Channel #${selectedChannelId} Listings`
                                        : 'Available Listings'}
                                </span>
                                <div className="ml-3 h-px flex-grow bg-gradient-to-r from-[#37E8FF]/50 to-transparent"></div>
                            </h2>

                            <MarketplaceListings
                                selectedChannelId={selectedChannelId}
                                refresh={refreshCounter}
                            />
                        </div>
                    </div>

                    <div>
                        {isConnected && selectedChannelId && (
                            <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#FF3D8A]/20 transition-all">
                                <div className="mb-5">
                                    <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3D8A] to-[#37E8FF]">
                                        Create a Listing
                                    </h3>
                                    <p className="text-white/70 text-sm mb-4">
                                        Set the price and amount of shares you want to sell for Channel #{selectedChannelId}.
                                    </p>
                                </div>

                                <CreateListing
                                    channelId={selectedChannelId}
                                    onSuccess={handleListingCreated}
                                />
                            </div>
                        )}

                        {isConnected && !selectedChannelId && (
                            <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#37E8FF]/20 transition-all">
                                <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#A742FF]">
                                    Your Shares
                                </h3>
                                <p className="text-white/70 mb-4">
                                    Select a channel to create a listing and sell your shares.
                                </p>

                                <div className="mb-6">
                                    <ChannelSelector
                                        channels={channels}
                                        onSelect={handleChannelSelect}
                                        loading={loadingChannels}
                                    />
                                </div>

                                <div className="relative mt-4">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] rounded-full blur opacity-30"></div>
                                    <Link
                                        href="/channels"
                                        className="relative block w-full py-3 px-4 bg-[#1A1A24] text-white text-center rounded-full hover:shadow-glow transition-all border border-white/10 font-medium"
                                    >
                                        Browse All Channels
                                    </Link>
                                </div>
                            </div>
                        )}

                        {!isConnected && (
                            <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-[#37E8FF]/20 transition-all">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="w-16 h-16 rounded-full bg-[#1A1A24] border border-white/10 flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                                        Connect Wallet
                                    </h3>

                                    <p className="text-white/70 text-center mb-6">
                                        Connect your wallet to buy shares or create listings.
                                    </p>
                                </div>

                                <button
                                    onClick={connect}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-full font-medium hover:shadow-glow transition-all"
                                >
                                    Connect Wallet
                                </button>
                            </div>
                        )}

                        {/* Market Insights */}
                        <div className="mt-6 bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#A742FF] to-[#37E8FF]">
                                Market Insights
                            </h3>

                            <div className="space-y-3">
                                {loadingStats ? (
                                    // Loading skeleton
                                    <>
                                        <div className="h-6 bg-[#121218] rounded animate-pulse mb-2"></div>
                                        <div className="h-6 bg-[#121218] rounded animate-pulse mb-2"></div>
                                        <div className="h-6 bg-[#121218] rounded animate-pulse mb-2"></div>
                                    </>
                                ) : (
                                    <>
                                        {topChannels.length > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-white/70">Most Active Channel</span>
                                                <span className="font-medium">{topChannels[0]?.name}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70">Active Listings</span>
                                            <span className="font-medium">{marketStats.activeListings}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/70">Avg Price Per Share</span>
                                            <span className="font-medium">{marketStats.avgPrice} S</span>
                                        </div>
                                    </>
                                )}

                                <div className="h-px w-full bg-white/10 my-4"></div>

                                <div className="bg-[#121218]/80 rounded-lg p-3">
                                    <div className="text-sm font-medium mb-2">Trending Categories</div>
                                    <div className="flex flex-wrap gap-2">
                                        {loadingStats ? (
                                            // Loading skeleton for categories
                                            <>
                                                <div className="w-16 h-6 bg-[#1A1A24] rounded animate-pulse"></div>
                                                <div className="w-20 h-6 bg-[#1A1A24] rounded animate-pulse"></div>
                                                <div className="w-14 h-6 bg-[#1A1A24] rounded animate-pulse"></div>
                                            </>
                                        ) : trendingCategories.length > 0 ? (
                                            trendingCategories.map((category, index) => (
                                                <span
                                                    key={category.name}
                                                    className={`px-2 py-1 rounded-full ${categoryColors[index % categoryColors.length].bg} ${categoryColors[index % categoryColors.length].text} text-xs`}
                                                >
                                                    {category.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-white/50 text-xs">No categories available</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}