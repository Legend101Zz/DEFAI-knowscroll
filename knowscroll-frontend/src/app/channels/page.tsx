"use client";

import { useState, useEffect } from 'react';
import AppNavBar from '@/components/layout/AppNavBar';
import Link from 'next/link';
import Image from 'next/image';
import { useWallet } from '@/context/WalletContext';

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

// Channel Card Component
const ChannelCard = ({ channel, isOwned = false, onSelectChannel }) => {
    // Categories would be mapped to different colors for visual variety
    const categoryColors = {
        'Education': 'from-[#37E8FF] to-[#20A4FF]',
        'Science': 'from-[#FF3D8A] to-[#FF698C]',
        'History': 'from-[#A742FF] to-[#C278FF]',
        'Technology': 'from-[#37E8FF] to-[#A742FF]',
        'Finance': 'from-[#FFC137] to-[#FF9900]',
        'Art': 'from-[#FF3D8A] to-[#FF7837]'
    };

    const categoryColor = categoryColors[channel.category] || 'from-[#37E8FF] to-[#FF3D8A]';

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
                        You own {channel.userShares || 0}%
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
                        <div className="text-xs text-white/60">Shareholders</div>
                        <div className="font-bold">{channel.shareholders || '--'}</div>
                    </div>
                    <div className="bg-[#121218] rounded-lg p-2 text-center">
                        <div className="text-xs text-white/60">Revenue</div>
                        <div className="font-bold">{channel.revenueToDate || '--'} S</div>
                    </div>
                </div>

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
const ChannelDetailsModal = ({ channel, onClose, onBuyShares, isConnected }) => {
    const [shareAmount, setShareAmount] = useState('');

    // Mock data that would come from blockchain
    const revenueHistory = [
        { period: 'Last 24h', amount: '0.042' },
        { period: 'Last Week', amount: '0.376' },
        { period: 'Last Month', amount: '1.248' }
    ];

    const shareholdersList = [
        { address: '0x7a2...3f8e', shares: '25%', isCreator: true },
        { address: '0x3b1...9c7a', shares: '15%' },
        { address: '0xd4f...6e2b', shares: '10%' },
        { address: '0x9a5...7c1d', shares: '5%' }
    ];

    // Governance proposals
    const proposals = [
        {
            id: 1,
            title: 'Add historical space missions series',
            status: 'Active',
            votesFor: 65,
            votesAgainst: 15
        },
        {
            id: 2,
            title: 'Focus more on quantum physics explanations',
            status: 'Passed',
            votesFor: 78,
            votesAgainst: 12
        }
    ];

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

                            {/* Channel Details Tabs */}
                            <div className="bg-[#121218]/60 rounded-xl p-5 mb-6">
                                <div className="flex border-b border-white/10 mb-4">
                                    <button className="px-4 py-2 border-b-2 border-[#37E8FF] text-white font-medium">Performance</button>
                                    <button className="px-4 py-2 text-white/60 hover:text-white transition-colors">Governance</button>
                                    <button className="px-4 py-2 text-white/60 hover:text-white transition-colors">Content</button>
                                </div>

                                {/* Revenue Performance */}
                                <div>
                                    <h4 className="text-sm font-medium text-white/70 mb-3">REVENUE HISTORY</h4>
                                    <div className="space-y-2 mb-4">
                                        {revenueHistory.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center py-2 border-b border-white/5">
                                                <span className="text-white/70">{item.period}</span>
                                                <span className="font-medium">{item.amount} S</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Channel Stats */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-[#121218] rounded-lg p-3">
                                            <div className="text-white/60 text-xs mb-1">Creation Date</div>
                                            <div className="font-medium">{new Date(channel.createdAt * 1000).toLocaleDateString()}</div>
                                        </div>
                                        <div className="bg-[#121218] rounded-lg p-3">
                                            <div className="text-white/60 text-xs mb-1">Channel Status</div>
                                            <div className="font-medium flex items-center">
                                                <span className={`w-2 h-2 rounded-full ${channel.active ? 'bg-green-500' : 'bg-red-500'} mr-1.5`}></span>
                                                {channel.active ? 'Active' : 'Inactive'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Governance Proposals */}
                                    <h4 className="text-sm font-medium text-white/70 mb-3 mt-6">GOVERNANCE PROPOSALS</h4>
                                    <div className="space-y-3">
                                        {proposals.map((proposal) => (
                                            <div key={proposal.id} className="bg-[#121218] rounded-lg p-3">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-medium">{proposal.title}</div>
                                                    <div className={`px-2 py-0.5 rounded-full text-xs ${proposal.status === 'Active' ? 'bg-[#37E8FF]/10 text-[#37E8FF]' : 'bg-green-500/10 text-green-500'}`}>
                                                        {proposal.status}
                                                    </div>
                                                </div>
                                                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]"
                                                        style={{ width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between mt-1 text-xs text-white/60">
                                                    <span>For: {proposal.votesFor}%</span>
                                                    <span>Against: {proposal.votesAgainst}%</span>
                                                </div>
                                            </div>
                                        ))}
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
                                        <span className="font-medium">{channel.userSharePercentage || '0'}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/70">Claimable Revenue</span>
                                        <span className="font-medium">{channel.claimableRevenue || '0'} S</span>
                                    </div>
                                </div>

                                {isConnected ? (
                                    <div className="space-y-3">
                                        {channel.claimableRevenue > 0 && (
                                            <button className="w-full py-2 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-lg font-medium hover:shadow-glow transition-all">
                                                Claim Revenue
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
                                    <button className="w-full py-2 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-lg font-medium hover:shadow-glow transition-all">
                                        Connect Wallet
                                    </button>
                                )}
                            </div>

                            {/* Shareholders List */}
                            <div className="bg-[#121218]/60 rounded-xl p-5">
                                <h3 className="text-lg font-bold mb-4">Top Shareholders</h3>
                                <div className="space-y-2">
                                    {shareholdersList.map((shareholder, index) => (
                                        <div key={index} className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-[#1A1A24] flex items-center justify-center mr-2">
                                                    <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium flex items-center">
                                                        {shareholder.address}
                                                        {shareholder.isCreator && (
                                                            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-[#FF3D8A]/20 text-[#FF3D8A]">
                                                                Creator
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="font-medium">{shareholder.shares}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Channels Page Component
export default function ChannelsPage() {
    const { isConnected } = useWallet();
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortOption, setSortOption] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');
    const [newChannelModal, setNewChannelModal] = useState(false);

    useEffect(() => {
        // Mock data - In production, this would fetch from your blockchain/API
        const fetchChannels = async () => {
            // Simulating API fetch delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock data based on your ChannelNFT contract structure
            const mockChannels = [
                {
                    id: 1,
                    name: "Space Explorers",
                    description: "Discover the mysteries of our universe through engaging short-form content about astronomy, space missions, and cosmic phenomena.",
                    category: "Science",
                    creator: "0x7a2...3f8e",
                    totalShares: 100,
                    createdAt: Date.now() / 1000 - 60 * 60 * 24 * 30, // 30 days ago
                    active: true,
                    shareholders: 14,
                    revenueToDate: "4.28",
                    userShares: 5, // If the current user owns shares
                    userSharePercentage: 5,
                    claimableRevenue: 0.21
                },
                {
                    id: 2,
                    name: "Modern History",
                    description: "Exploring pivotal moments in recent history through fact-based, educational content that contextualizes today's world.",
                    category: "History",
                    creator: "0x3b1...9c7a",
                    totalShares: 150,
                    createdAt: Date.now() / 1000 - 60 * 60 * 24 * 15, // 15 days ago
                    active: true,
                    shareholders: 8,
                    revenueToDate: "2.65",
                    userShares: 0,
                    userSharePercentage: 0,
                    claimableRevenue: 0
                },
                {
                    id: 3,
                    name: "AI Horizons",
                    description: "Breaking down complex AI concepts into digestible, engaging content. From machine learning basics to cutting edge research.",
                    category: "Technology",
                    creator: "0xd4f...6e2b",
                    totalShares: 120,
                    createdAt: Date.now() / 1000 - 60 * 60 * 24 * 45, // 45 days ago
                    active: true,
                    shareholders: 22,
                    revenueToDate: "8.12",
                    userShares: 10,
                    userSharePercentage: 8.33,
                    claimableRevenue: 0.67
                },
                {
                    id: 4,
                    name: "Quantum Physics Explained",
                    description: "Demystifying the strange world of quantum mechanics through intuitive analogies and visualizations.",
                    category: "Science",
                    creator: "0x9a5...7c1d",
                    totalShares: 80,
                    createdAt: Date.now() / 1000 - 60 * 60 * 24 * 7, // 7 days ago
                    active: true,
                    shareholders: 5,
                    revenueToDate: "1.08",
                    userShares: 0,
                    userSharePercentage: 0,
                    claimableRevenue: 0
                },
                {
                    id: 5,
                    name: "Financial Literacy",
                    description: "Essential knowledge about personal finance, investing, and economic principles presented in easy-to-digest formats.",
                    category: "Finance",
                    creator: "0x5e2...8f1a",
                    totalShares: 200,
                    createdAt: Date.now() / 1000 - 60 * 60 * 24 * 60, // 60 days ago
                    active: true,
                    shareholders: 31,
                    revenueToDate: "12.45",
                    userShares: 0,
                    userSharePercentage: 0,
                    claimableRevenue: 0
                },
                {
                    id: 6,
                    name: "Art Through Ages",
                    description: "A visual journey through art history, exploring influential movements, artists, and their impact on culture.",
                    category: "Art",
                    creator: "0x8c3...2d9b",
                    totalShares: 90,
                    createdAt: Date.now() / 1000 - 60 * 60 * 24 * 21, // 21 days ago
                    active: true,
                    shareholders: 7,
                    revenueToDate: "3.27",
                    userShares: 2,
                    userSharePercentage: 2.22,
                    claimableRevenue: 0.07
                }
            ];

            setChannels(mockChannels);
            setLoading(false);
        };

        fetchChannels();
    }, []);

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
            case 'mostRevenue':
                return parseFloat(b.revenueToDate) - parseFloat(a.revenueToDate);
            default:
                return 0;
        }
    });

    // Categories for filtering
    const categories = ['all', 'Science', 'History', 'Technology', 'Finance', 'Art', 'Education'];

    // User owned channels
    const userOwnedChannels = channels.filter(channel => channel.userShares > 0);

    return (
        <div className="min-h-screen bg-[#121218] text-white relative">
            <BackgroundAnimation />
            <AppNavBar />

            <main className="max-w-screen-xl mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="mb-12">
                    <div className="inline-flex items-center px-3 py-1 mb-4 text-sm rounded-full bg-[#1A1A24]/80 backdrop-blur-sm border border-[#37E8FF]/20">
                        <div className="w-2 h-2 rounded-full bg-[#37E8FF] mr-2 animate-pulse"></div>
                        <span className="text-white/80">Powered by Sonic Blockchain</span>
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

                        {isConnected && (
                            <button
                                onClick={() => setNewChannelModal(true)}
                                className="px-6 py-3 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-full font-medium hover:shadow-glow transition-all flex items-center whitespace-nowrap"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0h-6" />
                                </svg>
                                Create New Channel
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
                                <option value="mostRevenue">Highest Revenue</option>
                            </select>
                            <svg className="w-4 h-4 text-white/50 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Channels Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-[#37E8FF] animate-spin mb-4"></div>
                        <p className="text-white/70">Loading channels...</p>
                    </div>
                ) : sortedChannels.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedChannels.map(channel => (
                            <ChannelCard key={channel.id} channel={channel} isOwned={channel.userShares > 0} onSelectChannel={setSelectedChannel} />
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
                )}

                {/* Network Stats Section */}
                <div className="mt-16 bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                        Network Statistics
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[#121218]/80 rounded-xl p-4">
                            <div className="text-white/60 text-sm mb-1">Total Channels</div>
                            <div className="text-2xl font-bold">{channels.length}</div>
                        </div>

                        <div className="bg-[#121218]/80 rounded-xl p-4">
                            <div className="text-white/60 text-sm mb-1">Total Revenue</div>
                            <div className="text-2xl font-bold">
                                {channels.reduce((sum, channel) => sum + parseFloat(channel.revenueToDate || 0), 0).toFixed(2)} S
                            </div>
                        </div>

                        <div className="bg-[#121218]/80 rounded-xl p-4">
                            <div className="text-white/60 text-sm mb-1">Active Shareholders</div>
                            <div className="text-2xl font-bold">
                                {channels.reduce((sum, channel) => sum + (channel.shareholders || 0), 0)}
                            </div>
                        </div>

                        <div className="bg-[#121218]/80 rounded-xl p-4">
                            <div className="text-white/60 text-sm mb-1">Avg. Shares Per Channel</div>
                            <div className="text-2xl font-bold">
                                {Math.round(channels.reduce((sum, channel) => sum + channel.totalShares, 0) / channels.length)}
                            </div>
                        </div>
                    </div>

                    {/* Visual element: Category Distribution */}
                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-white/70 mb-3">CATEGORY DISTRIBUTION</h3>
                        <div className="h-4 w-full rounded-full overflow-hidden flex">
                            <div className="h-full bg-[#37E8FF]" style={{ width: '30%' }}></div>
                            <div className="h-full bg-[#FF3D8A]" style={{ width: '25%' }}></div>
                            <div className="h-full bg-[#A742FF]" style={{ width: '20%' }}></div>
                            <div className="h-full bg-[#FFC137]" style={{ width: '15%' }}></div>
                            <div className="h-full bg-[#4CAF50]" style={{ width: '10%' }}></div>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-[#37E8FF] mr-1.5"></div>
                                <span className="text-xs text-white/70">Science (30%)</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-[#FF3D8A] mr-1.5"></div>
                                <span className="text-xs text-white/70">History (25%)</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-[#A742FF] mr-1.5"></div>
                                <span className="text-xs text-white/70">Technology (20%)</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-[#FFC137] mr-1.5"></div>
                                <span className="text-xs text-white/70">Finance (15%)</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-[#4CAF50] mr-1.5"></div>
                                <span className="text-xs text-white/70">Art (10%)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Channel Details Modal */}
            {selectedChannel && (
                <ChannelDetailsModal
                    channel={selectedChannel}
                    onClose={() => setSelectedChannel(null)}
                    isConnected={isConnected}
                />
            )}

            {/* Create New Channel Modal - This would be implemented with form fields matching the ChannelNFT contract */}
            {newChannelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setNewChannelModal(false)}></div>

                    {/* Modal */}
                    <div className="relative bg-[#1A1A24] rounded-2xl border border-white/10 shadow-xl w-full max-w-lg p-6">
                        <button
                            onClick={() => setNewChannelModal(false)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>

                        <h2 className="text-xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                            Create New Channel
                        </h2>

                        <form className="space-y-4">
                            <div>
                                <label className="block text-white/70 text-sm mb-1">Channel Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter channel name"
                                    className="w-full px-4 py-2 bg-[#121218] rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm mb-1">Description</label>
                                <textarea
                                    placeholder="Describe your channel content"
                                    rows={4}
                                    className="w-full px-4 py-2 bg-[#121218] rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white resize-none"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm mb-1">Category</label>
                                <select
                                    className="w-full px-4 py-2 bg-[#121218] rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white appearance-none"
                                >
                                    <option value="">Select a category</option>
                                    {categories.filter(c => c !== 'all').map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm mb-1">Initial Shares</label>
                                <input
                                    type="number"
                                    placeholder="100"
                                    min="1"
                                    className="w-full px-4 py-2 bg-[#121218] rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white"
                                />
                                <p className="text-white/50 text-xs mt-1">
                                    You'll initially own 100% of these shares.
                                </p>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-lg font-medium hover:shadow-glow transition-all"
                                >
                                    Create Channel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}