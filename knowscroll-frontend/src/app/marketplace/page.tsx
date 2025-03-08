"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AppNavBar from '@/components/layout/AppNavBar';
import MarketplaceListings from '@/components/marketplace/MarketplaceListings';
import CreateListing from '@/components/marketplace/CreateListing';
import { useWallet } from '@/context/WalletContext';
import Link from 'next/link';
import Image from 'next/image';

// Background animation component to match homepage style
const BackgroundAnimation = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
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

export default function MarketplacePage() {
    const { isConnected } = useWallet();
    const searchParams = useSearchParams();
    const channelParam = searchParams.get('channel');
    const [selectedChannelId, setSelectedChannelId] = useState<number | undefined>(
        channelParam ? parseInt(channelParam) : undefined
    );
    const [refreshCounter, setRefreshCounter] = useState<number>(0);
    const [marketStats, setMarketStats] = useState({
        totalVolume: "3,245.82",
        activeListings: "247",
        avgPrice: "0.428"
    });

    // Function to refresh listings after creating a new one
    const handleListingCreated = () => {
        setRefreshCounter(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-[#121218] text-white relative">
            <BackgroundAnimation />
            <AppNavBar />

            <main className="max-w-screen-xl mx-auto px-4 py-12">
                {/* Header Section with Stats */}
                <div className="relative z-10 mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="inline-flex items-center px-3 py-1 mb-4 text-sm rounded-full bg-[#1A1A24]/80 backdrop-blur-sm border border-[#37E8FF]/20">
                                <div className="w-2 h-2 rounded-full bg-[#37E8FF] mr-2 animate-pulse"></div>
                                <span className="text-white/80">Sonic Blockchain Marketplace</span>
                            </div>

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
                            <div className="text-white/60 text-sm mb-1">24h Volume</div>
                            <div className="flex items-end">
                                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                                    {marketStats.totalVolume}
                                </div>
                                <div className="ml-1 text-white/60 text-sm">S</div>
                            </div>
                        </div>

                        <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-[#FF3D8A]/30 transition-all">
                            <div className="text-white/60 text-sm mb-1">Active Listings</div>
                            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF3D8A] to-[#A742FF]">
                                {marketStats.activeListings}
                            </div>
                        </div>

                        <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:border-[#A742FF]/30 transition-all">
                            <div className="text-white/60 text-sm mb-1">Average Price</div>
                            <div className="flex items-end">
                                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#A742FF] to-[#37E8FF]">
                                    {marketStats.avgPrice}
                                </div>
                                <div className="ml-1 text-white/60 text-sm">S per share</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        {/* Placeholder for MarketplaceListings - you'll need to restyle this component separately */}
                        <div className="bg-[#1A1A24]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-6 flex items-center">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                                    Available Listings
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
                                    Create a Listing
                                </h3>
                                <p className="text-white/70 mb-6">
                                    Select a specific channel to create a listing for its shares.
                                </p>

                                <div className="relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] rounded-full blur opacity-30"></div>
                                    <Link
                                        href="/channels"
                                        className="relative block w-full py-3 px-4 bg-[#1A1A24] text-white text-center rounded-full hover:shadow-glow transition-all border border-white/10 font-medium"
                                    >
                                        Browse Channels
                                    </Link>
                                </div>

                                {/* Recommended channels section */}
                                <div className="mt-8">
                                    <h4 className="text-sm font-medium text-white/70 mb-4">RECOMMENDED CHANNELS</h4>
                                    <div className="space-y-3">
                                        {[1, 2, 3].map(id => (
                                            <Link key={id} href={`/marketplace?channel=${id}`}>
                                                <div className="flex items-center p-3 rounded-lg bg-[#121218]/80 hover:bg-[#1A1A24] transition-all border border-white/5 hover:border-[#37E8FF]/30">
                                                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#37E8FF]/20 to-[#FF3D8A]/20 flex items-center justify-center mr-3">
                                                        <span className="text-white/90 font-medium">#{id}</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">Space Explorers</div>
                                                        <div className="text-xs text-white/50">12 active listings</div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
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

                                <button className="w-full py-3 px-4 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-full font-medium hover:shadow-glow transition-all">
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
                                <div className="flex justify-between items-center">
                                    <span className="text-white/70">Highest Valued Channel</span>
                                    <span className="font-medium">Quantum Physics</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-white/70">Most Active Channel</span>
                                    <span className="font-medium">Future Tech</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-white/70">New Channels (24h)</span>
                                    <span className="font-medium">18</span>
                                </div>

                                <div className="h-px w-full bg-white/10 my-4"></div>

                                <div className="bg-[#121218]/80 rounded-lg p-3">
                                    <div className="text-sm font-medium mb-2">Trending Categories</div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 rounded-full bg-[#37E8FF]/10 text-[#37E8FF] text-xs">History</span>
                                        <span className="px-2 py-1 rounded-full bg-[#FF3D8A]/10 text-[#FF3D8A] text-xs">Science</span>
                                        <span className="px-2 py-1 rounded-full bg-[#A742FF]/10 text-[#A742FF] text-xs">AI</span>
                                        <span className="px-2 py-1 rounded-full bg-white/10 text-white/70 text-xs">Space</span>
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