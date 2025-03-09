/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ethers } from 'ethers';
import AppNavBar from '@/components/layout/AppNavBar';
import { useWallet } from '@/context/WalletContext';
import { useChannelNFT, useRevenueDistribution } from '@/hooks/useContract';
import { TESTNET_CHAIN_ID, } from '@/lib/contracts/addresses';

// Types
interface Channel {
    id: number;
    name: string;
    description: string;
    category: string;
    creator: string;
    totalShares: number;
    createdAt: number;
    active: boolean;
    userShares?: number;
    userSharePercentage?: number;
    claimableRevenue?: number;
    transactionHash?: string;
}

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

// Channel Card Component
const ChannelCard = ({
    channel,
    isOwned = false,
    onSelectChannel
}: {
    channel: Channel;
    isOwned?: boolean;
    onSelectChannel: (channel: Channel) => void
}) => {
    // Categories would be mapped to different colors for visual variety
    const categoryColors: Record<string, string> = {
        'Education': 'from-[#37E8FF] to-[#20A4FF]',
        'Science': 'from-[#FF3D8A] to-[#FF698C]',
        'History': 'from-[#A742FF] to-[#C278FF]',
        'Technology': 'from-[#37E8FF] to-[#A742FF]',
        'Finance': 'from-[#FFC137] to-[#FF9900]',
        'Art': 'from-[#FF3D8A] to-[#FF7837]'
    };

    const categoryColor = categoryColors[channel.category] || 'from-[#37E8FF] to-[#FF3D8A]';

    // Sonic Explorer URL
    const getExplorerUrl = (hash: string) => {
        return `https://testnet.sonicscan.org/tx/${hash}`;
    };

    return (
        <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-[#37E8FF]/30 transition-all transform hover:translate-y-[-5px] duration-300">
            {/* Channel Banner/Preview */}
            <div className="h-32 relative overflow-hidden">
                {/* Dynamically generated placeholder */}
                <div className={`absolute inset-0 bg-gradient-to-r ${categoryColor}`}>
                    <div className="absolute inset-0 opacity-20 flex items-center justify-center">
                        <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </div>
                </div>

                {/* Channel ID Badge */}
                <div className="absolute top-3 left-3 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    Channel #{channel.id}
                </div>

                {/* Ownership Badge (if applicable) */}
                {isOwned && (
                    <div className="absolute top-3 right-3 bg-[#37E8FF]/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-[#37E8FF]">
                        You own {channel.userSharePercentage?.toFixed(2) || 0}%
                    </div>
                )}
            </div>

            {/* Channel Info */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl text-white">{channel.name}</h3>
                    <div className={`px-2 py-1 rounded-full bg-${categoryColor.split(' ')[0].replace('from-', '')}/10 text-${categoryColor.split(' ')[0].replace('from-', '')} text-xs`}>
                        {channel.category}
                    </div>
                </div>

                <p className="text-white/70 text-sm mb-4 line-clamp-2">{channel.description}</p>

                {/* Channel Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-[#121218] rounded-lg p-2 text-center">
                        <div className="text-xs text-white/60">Total Shares</div>
                        <div className="font-bold">{channel.totalShares}</div>
                    </div>
                    <div className="bg-[#121218] rounded-lg p-2 text-center">
                        <div className="text-xs text-white/60">Creator</div>
                        <div className="font-bold truncate text-xs" title={channel.creator}>
                            {channel.creator.substring(0, 6)}...{channel.creator.substring(channel.creator.length - 4)}
                        </div>
                    </div>
                    <div className="bg-[#121218] rounded-lg p-2 text-center">
                        <div className="text-xs text-white/60">Created</div>
                        <div className="font-bold text-xs">
                            {new Date(channel.createdAt * 1000).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                {/* Blockchain Metadata */}
                {channel.transactionHash && (
                    <div className="mb-4">
                        <a
                            href={getExplorerUrl(channel.transactionHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#37E8FF] hover:underline flex items-center"
                        >
                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View on Sonic Testnet Explorer
                        </a>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <button
                        onClick={() => onSelectChannel(channel)}
                        className="flex-1 py-2 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-lg font-medium text-sm hover:shadow-glow transition-all"
                    >
                        View Details
                    </button>
                    <Link
                        href={`/marketplace?channel=${channel.id}`}
                        className="flex-1 py-2 bg-[#121218] border border-white/10 text-white text-center rounded-lg font-medium text-sm hover:border-[#37E8FF]/30 transition-all"
                    >
                        Trade Shares
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Channel Details Modal Component
const ChannelDetailsModal = ({
    channel,
    onClose,
    isConnected,
    onClaimRevenue
}: {
    channel: Channel;
    onClose: () => void;
    isConnected: boolean;
    onClaimRevenue: (channelId: number) => Promise<void>;
}) => {
    const [loadingClaim, setLoadingClaim] = useState(false);

    // Sonic Testnet Explorer URL
    const getExplorerUrl = (address: string) => {
        return `https://testnet.sonicscan.org/address/${address}`;
    };

    // Format addresses for display
    const formatAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    // Handle claim revenue action
    const handleClaimRevenue = async () => {
        if (!isConnected || !channel.claimableRevenue) return;

        try {
            setLoadingClaim(true);
            await onClaimRevenue(channel.id);
        } catch (error) {
            console.error("Failed to claim revenue:", error);
        } finally {
            setLoadingClaim(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative bg-[#1A1A24] rounded-2xl border border-white/10 shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Modal Header with Banner */}
                <div className="h-40 relative bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center hover:bg-black/50 transition-all"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>

                    <div className="absolute bottom-4 left-6 flex items-center">
                        <div className="w-16 h-16 rounded-xl bg-[#1A1A24] flex items-center justify-center mr-4 border-2 border-white shadow-lg">
                            <span className="text-2xl font-bold">#{channel.id}</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{channel.name}</h2>
                            <div className="flex items-center">
                                <div className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs mr-2">
                                    {channel.category}
                                </div>
                                <div className="text-white/90 text-sm">Created {new Date(channel.createdAt * 1000).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-10rem)]">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold mb-3">About this Channel</h3>
                                <p className="text-white/70">{channel.description}</p>
                            </div>

                            {/* Channel Details */}
                            <div className="bg-[#121218]/60 rounded-xl p-5 mb-6">
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-white/70 mb-3">CHANNEL DETAILS</h4>

                                    {/* Channel Blockchain Information */}
                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-white/70">Creator Address</span>
                                            <a
                                                href={getExplorerUrl(channel.creator)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-[#37E8FF] hover:underline"
                                            >
                                                {formatAddress(channel.creator)}
                                            </a>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-white/70">Creation Date</span>
                                            <span className="font-medium">{new Date(channel.createdAt * 1000).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-white/70">Creation Transaction</span>
                                            {channel.transactionHash ? (
                                                <a
                                                    href={`https://sonicscan.org/tx/${channel.transactionHash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-medium text-[#37E8FF] hover:underline"
                                                >
                                                    {channel.transactionHash.substring(0, 10)}...
                                                </a>
                                            ) : (
                                                <span className="font-medium text-white/50">Not available</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-white/70">Active Status</span>
                                            <span className="font-medium flex items-center">
                                                <span className={`w-2 h-2 rounded-full ${channel.active ? 'bg-green-500' : 'bg-red-500'} mr-1.5`}></span>
                                                {channel.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            {/* Ownership and Action Panel */}
                            <div className="bg-[#121218]/60 rounded-xl p-5 mb-6">
                                <h3 className="text-lg font-bold mb-4">Channel Ownership</h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-white/70">Total Shares</span>
                                        <span className="font-medium">{channel.totalShares}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/70">Your Shares</span>
                                        <span className="font-medium">{channel.userShares || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/70">Share of Revenue</span>
                                        <span className="font-medium">{channel.userSharePercentage?.toFixed(2) || '0'}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/70">Claimable Revenue</span>
                                        <span className="font-medium">{channel.claimableRevenue?.toFixed(6) || '0'} S</span>
                                    </div>
                                </div>

                                {isConnected ? (
                                    <div className="space-y-3">
                                        {channel.claimableRevenue && channel.claimableRevenue > 0 && (
                                            <button
                                                className="w-full py-2 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-lg font-medium hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                                                onClick={handleClaimRevenue}
                                                disabled={loadingClaim}
                                            >
                                                {loadingClaim ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Claiming...
                                                    </>
                                                ) : (
                                                    'Claim Revenue'
                                                )}
                                            </button>
                                        )}

                                        <div className="grid grid-cols-2 gap-3">
                                            <Link
                                                href={`/marketplace?channel=${channel.id}`}
                                                className="py-2 bg-[#1A1A24] border border-white/10 text-white text-center rounded-lg font-medium hover:border-[#37E8FF]/30 transition-all"
                                            >
                                                Trade Shares
                                            </Link>

                                            <Link
                                                href={`/governance?channel=${channel.id}`}
                                                className="py-2 bg-[#1A1A24] border border-white/10 text-white text-center rounded-lg font-medium hover:border-[#37E8FF]/30 transition-all"
                                            >
                                                Governance
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        className="w-full py-2 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-lg font-medium hover:shadow-glow transition-all"
                                        onClick={onClose}
                                    >
                                        Connect Wallet to Interact
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Create Channel Modal Component
const CreateChannelModal = ({
    onClose,
    onCreateChannel,
    isCreating
}: {
    onClose: () => void;
    onCreateChannel: (channelData: { name: string; description: string; category: string; initialShares: number }) => Promise<void>;
    isCreating: boolean;
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [initialShares, setInitialShares] = useState(100);

    // Form validation
    const isValid = name.trim() !== '' && description.trim() !== '' && category !== '' && initialShares > 0;

    // Categories list
    const categories = ['Science', 'History', 'Technology', 'Finance', 'Art', 'Education'];

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || isCreating) return;

        await onCreateChannel({
            name,
            description,
            category,
            initialShares
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative bg-[#1A1A24] rounded-2xl border border-white/10 shadow-xl w-full max-w-lg p-6">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
                >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <h2 className="text-xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                    Create New Channel
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-white/70 text-sm mb-1">Channel Name</label>
                        <input
                            type="text"
                            placeholder="Enter channel name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 bg-[#121218] rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm mb-1">Description</label>
                        <textarea
                            placeholder="Describe your channel content"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 bg-[#121218] rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white resize-none"
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm mb-1">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2 bg-[#121218] rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white appearance-none"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm mb-1">Initial Shares</label>
                        <input
                            type="number"
                            placeholder="100"
                            min="1"
                            value={initialShares}
                            onChange={(e) => setInitialShares(parseInt(e.target.value))}
                            className="w-full px-4 py-2 bg-[#121218] rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white"
                            required
                        />
                        <p className="text-white/50 text-xs mt-1">
                            You&apos;ll initially own 100% of these shares.
                        </p>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={!isValid || isCreating}
                            className="w-full py-3 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-lg font-medium hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {isCreating ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Channel...
                                </>
                            ) : (
                                'Create Channel'
                            )}
                        </button>
                    </div>
                </form>
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

// Main Channels Page Component
export default function ChannelsPage() {
    const { isConnected, account, connect, chainId } = useWallet();
    const { contract: channelNFT, loading: loadingNFT } = useChannelNFT();
    const { contract: revenueDistribution } = useRevenueDistribution();

    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortOption, setSortOption] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');
    const [newChannelModal, setNewChannelModal] = useState(false);
    const [isCreatingChannel, setIsCreatingChannel] = useState(false);
    const [statsData, setStatsData] = useState({
        totalChannels: 0,
        totalShares: 0,
        totalCreators: 0,
        categoryDistribution: {} as Record<string, number>
    });

    // Fetch all channels
    useEffect(() => {
        const fetchChannels = async () => {
            if (!channelNFT) {
                console.log("Channel NFT contract not available yet");
                return;
            }

            try {
                setLoading(true);
                console.log("Starting to fetch channels...");

                // Get total number of channels
                const totalChannelsData = await channelNFT.getTotalChannels();
                const totalChannels = Number(totalChannelsData.toString());
                console.log(`Total channels found: ${totalChannels}`);

                if (totalChannels === 0) {
                    console.log("No channels found");
                    setChannels([]);
                    setLoading(false);
                    return;
                }

                // Fetch all channels
                const fetchedChannels: Channel[] = [];
                const creators = new Set<string>();
                const categoryCount: Record<string, number> = {};
                let totalSharesCount = 0;

                for (let i = 1; i <= totalChannels; i++) {
                    console.log(`Fetching channel ID: ${i}`);
                    try {
                        const channelData = await channelNFT.getChannel(i);
                        console.log(`Channel ${i} data:`, channelData);

                        // Extract data from the channel
                        const channel: Channel = {
                            id: i,
                            name: channelData.name,
                            description: channelData.description,
                            category: channelData.category,
                            creator: channelData.creator,
                            totalShares: Number(channelData.totalShares.toString()),
                            createdAt: Number(channelData.createdAt.toString()),
                            active: channelData.active,
                        };

                        // Update statistics data
                        creators.add(channelData.creator);
                        totalSharesCount += Number(channelData.totalShares.toString());

                        // Update category distribution
                        if (categoryCount[channel.category]) {
                            categoryCount[channel.category]++;
                        } else {
                            categoryCount[channel.category] = 1;
                        }

                        // If user is connected, get their shares and claimable revenue
                        if (account) {
                            const userShares = await channelNFT.balanceOf(account, i);
                            channel.userShares = Number(userShares.toString());

                            if (channel.userShares > 0) {
                                channel.userSharePercentage = (channel.userShares / channel.totalShares) * 100;

                                // Get claimable revenue
                                if (revenueDistribution) {
                                    const claimable = await revenueDistribution.getClaimableRevenue(i, account);
                                    channel.claimableRevenue = Number(ethers.utils.formatEther(claimable));
                                }
                            }
                        }

                        fetchedChannels.push(channel);
                    } catch (channelError) {
                        console.error(`Error fetching channel ${i}:`, channelError);
                        // Continue to next channel instead of failing the whole process
                    }
                }

                // Update stats
                setStatsData({
                    totalChannels,
                    totalShares: totalSharesCount,
                    totalCreators: creators.size,
                    categoryDistribution: categoryCount
                });

                console.log(`Successfully fetched ${fetchedChannels.length} channels`);
                setChannels(fetchedChannels);
            } catch (error) {
                console.error("Error fetching channels:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChannels();
    }, [channelNFT, account, isConnected, revenueDistribution]);

    // Create a new channel
    const createChannel = async (channelData: { name: string; description: string; category: string; initialShares: number }) => {
        if (!channelNFT || !isConnected) return;

        try {
            setIsCreatingChannel(true);

            const tx = await channelNFT.createChannel(
                channelData.name,
                channelData.description,
                channelData.category,
                channelData.initialShares
            );

            await tx.wait();

            // Get the channel ID from the event (assumes the event is the first one)
            const receipt = await tx.wait();
            const event = receipt.events?.find((e: any) => e.event === 'ChannelCreated');
            const channelId = event?.args?.channelId;

            // Create the new channel object with transaction hash
            const newChannel: Channel = {
                id: Number(channelId),
                name: channelData.name,
                description: channelData.description,
                category: channelData.category,
                creator: account || '',
                totalShares: channelData.initialShares,
                createdAt: Math.floor(Date.now() / 1000),
                active: true,
                userShares: channelData.initialShares,
                userSharePercentage: 100,
                claimableRevenue: 0,
                transactionHash: tx.hash
            };

            // Add to channels list
            setChannels(prev => [...prev, newChannel]);

            // Update stats
            setStatsData(prev => ({
                ...prev,
                totalChannels: prev.totalChannels + 1,
                totalShares: prev.totalShares + channelData.initialShares,
                categoryDistribution: {
                    ...prev.categoryDistribution,
                    [channelData.category]: (prev.categoryDistribution[channelData.category] || 0) + 1
                }
            }));

            // Close modal
            setNewChannelModal(false);

        } catch (error) {
            console.error("Error creating channel:", error);
        } finally {
            setIsCreatingChannel(false);
        }
    };

    // Claim revenue for a channel
    const claimRevenue = async (channelId: number) => {
        if (!revenueDistribution || !isConnected) return;

        try {
            const tx = await revenueDistribution.claimRevenue(channelId);
            await tx.wait();

            // Update the channel's claimable revenue
            setChannels(prev =>
                prev.map(channel =>
                    channel.id === channelId
                        ? { ...channel, claimableRevenue: 0 }
                        : channel
                )
            );

            // Also update selected channel if it's the one we claimed for
            if (selectedChannel && selectedChannel.id === channelId) {
                setSelectedChannel({ ...selectedChannel, claimableRevenue: 0 });
            }

            return tx.hash;
        } catch (error) {
            console.error("Error claiming revenue:", error);
            throw error;
        }
    };

    // Filtering channels based on category and search query
    const filteredChannels = channels.filter(channel => {
        const categoryMatch = filterCategory === 'all' || channel.category === filterCategory;
        const searchMatch = channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            channel.description.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && searchMatch;
    });

    // Sorting channels based on selected option
    const sortedChannels = [...filteredChannels].sort((a, b) => {
        switch (sortOption) {
            case 'newest':
                return b.createdAt - a.createdAt;
            case 'oldest':
                return a.createdAt - b.createdAt;
            case 'mostShares':
                return b.totalShares - a.totalShares;
            default:
                return 0;
        }
    });

    // Categories for filtering - derive from actual data
    const categories = ['all', ...Array.from(new Set(channels.map(c => c.category)))];

    // User owned channels
    const userOwnedChannels = channels.filter(channel => (channel.userShares || 0) > 0);

    // Calculate category distribution percentages for the visualization
    const categoryDistribution = Object.entries(statsData.categoryDistribution).map(([category, count]) => ({
        category,
        count,
        percentage: (count / statsData.totalChannels) * 100
    })).sort((a, b) => b.percentage - a.percentage);

    // Empty state component
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-16 bg-[#1A1A24]/30 rounded-xl border border-white/10">
            <svg className="w-24 h-24 text-white/20 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">No Channels Found</h3>
            <p className="text-white/70 text-center max-w-md mb-8">
                Be the first to create a channel on KnowScroll and start sharing AI-generated educational content!
            </p>
            {isConnected ? (
                <button
                    onClick={() => setNewChannelModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-full font-medium hover:shadow-glow transition-all flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0h-6" />
                    </svg>
                    Create Your First Channel
                </button>
            ) : (
                <button
                    onClick={connect}
                    className="px-6 py-3 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-full font-medium hover:shadow-glow transition-all flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Connect Wallet to Get Started
                </button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#121218] text-white relative">
            <BackgroundAnimation />
            <AppNavBar />

            {/* Network Switcher */}
            {isConnected && <NetworkSwitcher currentChainId={chainId} />}

            <main className="max-w-screen-xl mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row gap-2 mb-4">
                        <div className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-[#1A1A24]/80 backdrop-blur-sm border border-[#37E8FF]/20">
                            <div className="w-2 h-2 rounded-full bg-[#37E8FF] mr-2 animate-pulse"></div>
                            <span className="text-white/80">Powered by Sonic Blockchain</span>
                        </div>

                        <div className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-[#FFB800]/20 backdrop-blur-sm border border-[#FFB800]/30">
                            <span className="text-[#FFB800] font-medium">TESTNET MODE</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-3">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                                    Explore AI Channels
                                </span>
                            </h1>

                            <p className="text-white/70 text-lg max-w-2xl">
                                Discover AI-generated content channels, own shares, and earn revenue as they grow in popularity.
                            </p>
                        </div>

                        {isConnected ? (
                            <button
                                onClick={() => setNewChannelModal(true)}
                                className="px-6 py-3 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-full font-medium hover:shadow-glow transition-all flex items-center whitespace-nowrap"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0h-6" />
                                </svg>
                                Create New Channel
                            </button>
                        ) : (
                            <button
                                onClick={connect}
                                className="px-6 py-3 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-full font-medium hover:shadow-glow transition-all flex items-center whitespace-nowrap"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>

                {/* User Owned Channels Section */}
                {userOwnedChannels.length > 0 && (
                    <div className="mb-10">
                        <div className="flex items-center mb-6">
                            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                                Your Channels
                            </h2>
                            <div className="ml-3 h-px flex-grow bg-gradient-to-r from-[#37E8FF]/50 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {userOwnedChannels.map(channel => (
                                <ChannelCard key={channel.id} channel={channel} isOwned={true} onSelectChannel={setSelectedChannel} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Search and Filter Section */}
                {channels.length > 0 && (
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                        <div className="relative w-full md:w-auto md:min-w-[300px]">
                            <input
                                type="text"
                                placeholder="Search channels..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pl-10 bg-[#1A1A24]/60 rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white"
                            />
                            <svg className="w-5 h-5 text-white/50 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <div className="flex flex-wrap gap-3 w-full md:w-auto">
                            <div className="relative">
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="appearance-none w-full md:w-auto px-4 py-2 pr-10 bg-[#1A1A24]/60 rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.filter(c => c !== 'all').map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                                <svg className="w-4 h-4 text-white/50 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            <div className="relative">
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="appearance-none w-full md:w-auto px-4 py-2 pr-10 bg-[#1A1A24]/60 rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="mostShares">Most Shares</option>
                                </select>
                                <svg className="w-4 h-4 text-white/50 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}

                {/* Channels Grid */}
                {loading || loadingNFT ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 border-t-2 border-b-2 border-[#37E8FF] rounded-full animate-spin mb-4"></div>
                        <p className="text-white/70 text-lg">Loading channels from blockchain...</p>
                    </div>
                ) : channels.length > 0 ? (
                    sortedChannels.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sortedChannels.map(channel => (
                                <ChannelCard
                                    key={channel.id}
                                    channel={channel}
                                    isOwned={(channel.userShares || 0) > 0}
                                    onSelectChannel={setSelectedChannel}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 bg-[#1A1A24]/30 rounded-xl border border-white/10">
                            <svg className="w-16 h-16 text-white/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-white/70 text-lg mb-2">No channels found</p>
                            <p className="text-white/50 text-sm">Try adjusting your search or filters</p>
                        </div>
                    )
                ) : (
                    <EmptyState />
                )}

                {/* Network Stats Section */}
                {channels.length > 0 && (
                    <div className="mt-16 bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                            Network Statistics
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-[#121218]/80 rounded-xl p-4">
                                <div className="text-white/60 text-sm mb-1">Total Channels</div>
                                <div className="text-2xl font-bold">{statsData.totalChannels}</div>
                            </div>

                            <div className="bg-[#121218]/80 rounded-xl p-4">
                                <div className="text-white/60 text-sm mb-1">Total Shares</div>
                                <div className="text-2xl font-bold">{statsData.totalShares.toLocaleString()}</div>
                            </div>

                            <div className="bg-[#121218]/80 rounded-xl p-4">
                                <div className="text-white/60 text-sm mb-1">Unique Creators</div>
                                <div className="text-2xl font-bold">{statsData.totalCreators}</div>
                            </div>

                            <div className="bg-[#121218]/80 rounded-xl p-4">
                                <div className="text-white/60 text-sm mb-1">Avg. Shares Per Channel</div>
                                <div className="text-2xl font-bold">
                                    {statsData.totalChannels > 0 ? Math.round(statsData.totalShares / statsData.totalChannels) : 0}
                                </div>
                            </div>
                        </div>

                        {/* Visual element: Category Distribution */}
                        {categoryDistribution.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-white/70 mb-3">CATEGORY DISTRIBUTION</h3>
                                <div className="h-4 w-full rounded-full overflow-hidden flex">
                                    {categoryDistribution.map((category, index) => {
                                        // Define a color for each category based on its index
                                        const colors = [
                                            'bg-[#37E8FF]',
                                            'bg-[#FF3D8A]',
                                            'bg-[#A742FF]',
                                            'bg-[#FFC137]',
                                            'bg-[#4CAF50]',
                                            'bg-[#FF5722]',
                                            'bg-[#9C27B0]',
                                            'bg-[#3F51B5]'
                                        ];
                                        const colorClass = colors[index % colors.length];

                                        return (
                                            <div
                                                key={category.category}
                                                className={`h-full ${colorClass}`}
                                                style={{ width: `${category.percentage}%` }}
                                            ></div>
                                        );
                                    })}
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                                    {categoryDistribution.map((category, index) => {
                                        // Define a color for each category (matching the above colors)
                                        const colors = [
                                            'bg-[#37E8FF]',
                                            'bg-[#FF3D8A]',
                                            'bg-[#A742FF]',
                                            'bg-[#FFC137]',
                                            'bg-[#4CAF50]',
                                            'bg-[#FF5722]',
                                            'bg-[#9C27B0]',
                                            'bg-[#3F51B5]'
                                        ];
                                        const colorClass = colors[index % colors.length];

                                        return (
                                            <div key={category.category} className="flex items-center">
                                                <div className={`w-3 h-3 rounded-full ${colorClass} mr-1.5`}></div>
                                                <span className="text-xs text-white/70">
                                                    {category.category} ({Math.round(category.percentage)}%)
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Channel Details Modal */}
            {selectedChannel && (
                <ChannelDetailsModal
                    channel={selectedChannel}
                    onClose={() => setSelectedChannel(null)}
                    isConnected={isConnected}
                    onClaimRevenue={claimRevenue}
                />
            )}

            {/* Create New Channel Modal */}
            {newChannelModal && (
                <CreateChannelModal
                    onClose={() => setNewChannelModal(false)}
                    onCreateChannel={createChannel}
                    isCreating={isCreatingChannel}
                />
            )}
        </div>
    );
}