"use client"
import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Plus, Clock, Award, Heart, Zap, ChevronRight, Star, Shield, Sparkles, Wallet, LineChart } from 'lucide-react';

// Mocked contract addresses for demo
const CONTRACT_ADDRESSES = {
    channelNFT: "0x123...",
    revenueDistribution: "0x456...",
    marketplace: "0x789...",
    governance: "0xabc..."
};

const ProfilePage = () => {
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    // User data states
    const [profileData, setProfileData] = useState({
        totalValueLocked: 0,
        totalRevenue: 0,
        pendingRevenue: 0,
        createdChannels: [],
        ownedShares: [],
        listings: [],
        proposals: [],
        votedProposals: 0,
        totalChannels: 0
    });

    // Animation states
    const [showAnimation, setShowAnimation] = useState(false);
    const [recentActivity, setRecentActivity] = useState([
        { type: 'revenue', text: 'Earned 0.05 S from Physics Channel', time: '2 hours ago', icon: <Zap size={14} className="text-emerald-400" /> },
        { type: 'purchase', text: 'Purchased 5% of Blockchain Basics', time: '1 day ago', icon: <ArrowUpRight size={14} className="text-indigo-400" /> },
        { type: 'vote', text: 'Voted on "Add quantum computing section"', time: '3 days ago', icon: <Shield size={14} className="text-violet-400" /> },
        { type: 'create', text: 'Created "Machine Learning 101"', time: '1 week ago', icon: <Plus size={14} className="text-pink-400" /> }
    ]);

    // Mock data for visualizations
    const [revenueHistory] = useState([
        { month: 'Aug', value: 0.02 },
        { month: 'Sep', value: 0.05 },
        { month: 'Oct', value: 0.04 },
        { month: 'Nov', value: 0.08 },
        { month: 'Dec', value: 0.12 },
        { month: 'Jan', value: 0.15 },
        { month: 'Feb', value: 0.18 }
    ]);

    // Connection effect
    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setIsConnected(true);
            setAccount("0xf3d...e7a2");
            setLoading(false);

            // Trigger animation after loading
            setTimeout(() => {
                setShowAnimation(true);
            }, 300);
        }, 1500);

        // In a real app, we would connect to provider and contracts here
    }, []);

    // Fetch data effect (simulated)
    useEffect(() => {
        if (isConnected) {
            // This would normally fetch actual data from blockchain
            setProfileData({
                totalValueLocked: 1.85,
                totalRevenue: 0.62,
                pendingRevenue: 0.14,
                createdChannels: [
                    { id: 1, name: "Machine Learning 101", category: "Technology", totalShares: 100, ownedShares: 65, totalValue: 0.85, pendingRevenue: 0.05, image: "/api/placeholder/400/320" },
                    { id: 2, name: "Quantum Physics Explained", category: "Science", totalShares: 100, ownedShares: 100, totalValue: 0.45, pendingRevenue: 0.03, image: "/api/placeholder/400/320" }
                ],
                ownedShares: [
                    { id: 3, name: "History of Ancient Rome", category: "History", totalShares: 100, ownedShares: 12, totalValue: 0.32, pendingRevenue: 0.03, image: "/api/placeholder/400/320" },
                    { id: 4, name: "Economic Principles", category: "Finance", totalShares: 100, ownedShares: 8, totalValue: 0.23, pendingRevenue: 0.03, image: "/api/placeholder/400/320" }
                ],
                listings: [
                    { id: 1, channelId: 1, channelName: "Machine Learning 101", amount: 20, pricePerShare: 0.008, totalPrice: 0.16, listed: "3 days ago" }
                ],
                proposals: [
                    { id: 1, channelId: 1, channelName: "Machine Learning 101", description: "Add a section on neural networks", votesFor: 55, votesAgainst: 5, status: "active", endTime: "2 days left" },
                    { id: 2, channelId: 2, channelName: "Quantum Physics Explained", description: "Include practical applications", votesFor: 72, votesAgainst: 12, status: "passed", endTime: "ended" }
                ],
                votedProposals: 8,
                totalChannels: 6
            });
        }
    }, [isConnected]);

    // Handler for claiming revenue
    const handleClaimRevenue = (channelId) => {
        console.log(`Claiming revenue for channel ${channelId}`);
        // Would call the contract method here
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A10] text-white p-6">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] animate-pulse opacity-30"></div>
                        <div className="absolute inset-2 rounded-full bg-[#0A0A10] flex items-center justify-center">
                            <svg className="w-8 h-8 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    </div>
                    <p className="text-white/70 text-sm">Connecting to Sonic Blockchain...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A10] text-white pb-20">
            {/* Header with wavy gradient background */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#17065A] via-[#160D5A] to-[#0F0F52] opacity-50"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxwYXRoIGQ9Ik0gMCAxMCBMIDIwIDEwIiBzdHJva2U9IiMzN0U4RkYiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')] opacity-10"></div>

                <div className="relative px-6 py-16 md:py-24 lg:px-8 max-w-7xl mx-auto">
                    <div className={`transition-all duration-1000 transform ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                            <div className="flex items-center">
                                <div className="relative mr-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] flex items-center justify-center overflow-hidden">
                                        <div className="w-14 h-14 rounded-full bg-[#0A0A10] flex items-center justify-center text-lg font-bold">KS</div>
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#0A0A10] rounded-full flex items-center justify-center border-2 border-[#0A0A10]">
                                        <div className="w-full h-full rounded-full bg-emerald-400"></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center">
                                        <h1 className="text-xl md:text-3xl font-bold">{account}</h1>
                                        <div className="ml-2 px-2 py-1 rounded-md bg-[#37E8FF]/10 border border-[#37E8FF]/30">
                                            <span className="text-xs text-[#37E8FF]">Connected</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-1 text-white/60 text-sm">
                                        <span className="flex items-center"><Wallet size={14} className="mr-1 text-[#FF3D8A]" /> {profileData.totalValueLocked} S Locked</span>
                                        <span className="mx-2">•</span>
                                        <span className="flex items-center"><Star size={14} className="mr-1 text-[#37E8FF]" /> {profileData.createdChannels.length} Channels</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-2 mt-4 md:mt-0">
                                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white font-medium text-sm hover:opacity-90 transition-opacity">
                                    Create Channel
                                </button>
                                <button className="px-4 py-2 rounded-lg bg-[#1A1A24] text-white font-medium text-sm border border-white/10 hover:border-white/20 transition-colors">
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="px-4 md:px-6 max-w-7xl mx-auto -mt-10 relative z-10">
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-1000 transform ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '100ms' }}>
                    <div className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A10] rounded-2xl p-6 border border-white/5 shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-white/80 text-sm font-medium">Total Revenue</h3>
                            <div className="w-8 h-8 rounded-lg bg-[#37E8FF]/10 flex items-center justify-center">
                                <LineChart size={16} className="text-[#37E8FF]" />
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold">{profileData.totalRevenue}</span>
                            <span className="ml-1 text-white/60 text-sm">S</span>
                        </div>
                        <div className="flex items-center mt-2 text-xs">
                            <ArrowUpRight size={14} className="text-emerald-400 mr-1" />
                            <span className="text-emerald-400">+0.07 S</span>
                            <span className="text-white/60 ml-1">since last week</span>
                        </div>

                        {/* Mini chart */}
                        <div className="mt-4 h-10">
                            <div className="flex items-end justify-between h-full">
                                {revenueHistory.map((item, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <div
                                            className="w-1 rounded-t-sm bg-gradient-to-t from-[#37E8FF] to-[#FF3D8A]"
                                            style={{ height: `${item.value * 50}px`, opacity: i === revenueHistory.length - 1 ? 1 : 0.6 }}
                                        ></div>
                                        <span className="text-[8px] mt-1 text-white/40">{item.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A10] rounded-2xl p-6 border border-white/5 shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-white/80 text-sm font-medium">Pending Revenue</h3>
                            <div className="w-8 h-8 rounded-lg bg-[#A742FF]/10 flex items-center justify-center">
                                <Wallet size={16} className="text-[#A742FF]" />
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold">{profileData.pendingRevenue}</span>
                            <span className="ml-1 text-white/60 text-sm">S</span>
                        </div>
                        <div className="flex items-center mt-2 text-xs">
                            <Clock size={14} className="text-amber-400 mr-1" />
                            <span className="text-white/60">Available to claim</span>
                        </div>

                        <button
                            className="w-full mt-4 py-2 rounded-lg bg-[#A742FF]/20 border border-[#A742FF]/30 text-[#A742FF] text-sm font-medium hover:bg-[#A742FF]/30 transition-colors"
                            onClick={() => handleClaimRevenue('all')}
                        >
                            Claim All Revenue
                        </button>
                    </div>

                    <div className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A10] rounded-2xl p-6 border border-white/5 shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-white/80 text-sm font-medium">Governance</h3>
                            <div className="w-8 h-8 rounded-lg bg-[#FF3D8A]/10 flex items-center justify-center">
                                <Shield size={16} className="text-[#FF3D8A]" />
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold">{profileData.votedProposals}</span>
                            <span className="ml-1 text-white/60 text-sm">Proposals Voted</span>
                        </div>
                        <div className="flex items-center mt-2 text-xs">
                            <span className="text-white/60">{profileData.proposals.filter(p => p.status === 'active').length} active proposals need your vote</span>
                        </div>

                        <button
                            className="w-full mt-4 py-2 rounded-lg bg-[#FF3D8A]/20 border border-[#FF3D8A]/30 text-[#FF3D8A] text-sm font-medium hover:bg-[#FF3D8A]/30 transition-colors"
                            onClick={() => setActiveTab('governance')}
                        >
                            View Active Proposals
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-4 md:px-6 max-w-7xl mx-auto mt-10">
                <div className={`transition-all duration-1000 transform ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
                    <div className="flex overflow-x-auto space-x-2 pb-4 scrollbar-thin">
                        {['overview', 'my channels', 'owned shares', 'listings', 'governance'].map((tab) => (
                            <button
                                key={tab}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab
                                    ? 'bg-gradient-to-r from-[#37E8FF]/20 to-[#FF3D8A]/20 text-white border border-white/10'
                                    : 'bg-[#1A1A24]/50 text-white/60 border border-transparent hover:border-white/5'
                                    }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 md:px-6 max-w-7xl mx-auto mt-6">
                <div className={`transition-all duration-1000 transform ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A10] rounded-2xl p-6 border border-white/5 shadow-lg">
                                    <h2 className="text-lg font-medium mb-4">My Channels</h2>

                                    {profileData.createdChannels.length > 0 ? (
                                        <div className="space-y-4">
                                            {profileData.createdChannels.map((channel) => (
                                                <div key={channel.id} className="flex flex-col md:flex-row border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors bg-black/20">
                                                    <div className="w-full md:w-1/4 mb-4 md:mb-0 md:mr-4">
                                                        <div className="relative aspect-video rounded-lg overflow-hidden">
                                                            <img src={channel.image} alt={channel.name} className="object-cover w-full h-full" />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                                            <div className="absolute bottom-2 left-2 text-xs px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">{channel.category}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex-1">
                                                        <h3 className="text-base font-medium mb-1">{channel.name}</h3>
                                                        <div className="flex flex-wrap gap-2 text-xs mb-3">
                                                            <span className="text-white/60">Ownership: <span className="text-white">{channel.ownedShares}%</span></span>
                                                            <span className="text-white/20">|</span>
                                                            <span className="text-white/60">Value: <span className="text-white">{channel.totalValue} S</span></span>
                                                            <span className="text-white/20">|</span>
                                                            <span className="text-white/60">Pending: <span className="text-emerald-400">{channel.pendingRevenue} S</span></span>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2">
                                                            <button className="text-xs px-3 py-1 rounded-lg bg-[#37E8FF]/10 text-[#37E8FF] hover:bg-[#37E8FF]/20 transition-colors">
                                                                Manage Channel
                                                            </button>
                                                            {channel.pendingRevenue > 0 && (
                                                                <button
                                                                    className="text-xs px-3 py-1 rounded-lg bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 transition-colors"
                                                                    onClick={() => handleClaimRevenue(channel.id)}
                                                                >
                                                                    Claim {channel.pendingRevenue} S
                                                                </button>
                                                            )}
                                                            <button className="text-xs px-3 py-1 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 transition-colors">
                                                                Sell Shares
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 border border-dashed border-white/10 rounded-xl bg-white/5">
                                            <div className="w-12 h-12 rounded-full bg-[#1A1A24] mx-auto flex items-center justify-center mb-3">
                                                <Plus size={20} className="text-white/50" />
                                            </div>
                                            <p className="text-white/60 mb-4">You haven't created any channels yet</p>
                                            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white text-sm font-medium hover:opacity-90 transition-opacity">
                                                Create Your First Channel
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A10] rounded-2xl p-6 border border-white/5 shadow-lg">
                                    <h2 className="text-lg font-medium mb-4">Owned Shares</h2>

                                    {profileData.ownedShares.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {profileData.ownedShares.map((channel) => (
                                                <div key={channel.id} className="border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors bg-black/20">
                                                    <div className="flex items-center mb-3">
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden mr-3">
                                                            <img src={channel.image} alt={channel.name} className="object-cover w-full h-full" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-medium">{channel.name}</h3>
                                                            <span className="text-xs text-white/60">{channel.category}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span className="text-white/60">Ownership</span>
                                                            <span className="text-white">{channel.ownedShares}%</span>
                                                        </div>
                                                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]"
                                                                style={{ width: `${channel.ownedShares}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between text-xs mb-3">
                                                        <span className="text-white/60">Value</span>
                                                        <span className="text-white">{channel.totalValue} S</span>
                                                    </div>

                                                    {channel.pendingRevenue > 0 && (
                                                        <button
                                                            className="w-full text-xs px-3 py-1.5 rounded-lg bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 transition-colors"
                                                            onClick={() => handleClaimRevenue(channel.id)}
                                                        >
                                                            Claim {channel.pendingRevenue} S
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/5">
                                            <p className="text-white/60">You don't own shares in any other channels</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A10] rounded-2xl p-6 border border-white/5 shadow-lg">
                                    <h2 className="text-lg font-medium mb-4">Recent Activity</h2>

                                    <div className="space-y-4">
                                        {recentActivity.map((activity, i) => (
                                            <div key={i} className="flex items-start">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 mt-0.5">
                                                    {activity.icon}
                                                </div>
                                                <div>
                                                    <p className="text-sm text-white mb-0.5">{activity.text}</p>
                                                    <p className="text-xs text-white/50">{activity.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A10] rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden">
                                    <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#FF3D8A]/10 filter blur-xl"></div>
                                    <div className="absolute right-8 bottom-8 w-16 h-16 rounded-full bg-[#37E8FF]/10 filter blur-lg"></div>

                                    <h2 className="text-lg font-medium mb-3">Active Listings</h2>

                                    {profileData.listings.length > 0 ? (
                                        <div className="space-y-3">
                                            {profileData.listings.map(listing => (
                                                <div key={listing.id} className="border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors bg-black/20">
                                                    <h3 className="text-sm font-medium mb-1">{listing.channelName}</h3>
                                                    <div className="flex justify-between text-xs mb-2">
                                                        <span className="text-white/60">Amount</span>
                                                        <span className="text-white">{listing.amount}%</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs mb-2">
                                                        <span className="text-white/60">Price per Share</span>
                                                        <span className="text-white">{listing.pricePerShare} S</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs mb-3">
                                                        <span className="text-white/60">Total Price</span>
                                                        <span className="text-white">{listing.totalPrice} S</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-white/50">Listed {listing.listed}</span>
                                                        <button className="text-[#FF3D8A] hover:text-[#FF3D8A]/80 transition-colors">
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 border border-dashed border-white/10 rounded-xl bg-white/5">
                                            <p className="text-white/60 text-sm">No active listings</p>
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <button
                                            className="w-full py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/15 transition-colors"
                                            onClick={() => setActiveTab('listings')}
                                        >
                                            View All Listings
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A10] rounded-2xl p-6 border border-white/5 shadow-lg">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-medium">Active Proposals</h2>
                                        <span className="bg-[#FF3D8A]/20 text-[#FF3D8A] text-xs px-2 py-1 rounded-full">
                                            {profileData.proposals.filter(p => p.status === 'active').length} Active
                                        </span>
                                    </div>

                                    {profileData.proposals.filter(p => p.status === 'active').length > 0 ? (
                                        <div className="space-y-3">
                                            {profileData.proposals
                                                .filter(p => p.status === 'active')
                                                .map(proposal => (
                                                    <div key={proposal.id} className="border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors bg-black/20">
                                                        <div className="flex justify-between mb-2">
                                                            <h3 className="text-sm font-medium">{proposal.channelName}</h3>
                                                            <span className="text-xs text-white/60">{proposal.endTime}</span>
                                                        </div>
                                                        <p className="text-sm text-white/80 mb-3">{proposal.description}</p>

                                                        <div className="mb-2">
                                                            <div className="flex justify-between text-xs mb-1">
                                                                <span className="text-[#37E8FF]">For: {proposal.votesFor}%</span>
                                                                <span className="text-[#FF3D8A]">Against: {proposal.votesAgainst}%</span>
                                                            </div>
                                                            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                                <div
                                                                    className="h-full rounded-full bg-[#37E8FF]"
                                                                    style={{ width: `${proposal.votesFor}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>

                                                        <div className="flex space-x-2">
                                                            <button className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-[#37E8FF]/10 text-[#37E8FF] hover:bg-[#37E8FF]/20 transition-colors">
                                                                Vote For
                                                            </button>
                                                            <button className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-[#FF3D8A]/10 text-[#FF3D8A] hover:bg-[#FF3D8A]/20 transition-colors">
                                                                Vote Against
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 border border-dashed border-white/10 rounded-xl bg-white/5">
                                            <p className="text-white/60 text-sm">No active proposals</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* My Channels Tab */}
                    {activeTab === 'my channels' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-medium">My Channels</h2>
                                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center">
                                    <Plus size={16} className="mr-1" /> Create Channel
                                </button>
                            </div>

                            {profileData.createdChannels.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {profileData.createdChannels.map((channel) => (
                                        <div key={channel.id} className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A10] rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors group">
                                            <div className="relative aspect-video">
                                                <img src={channel.image} alt={channel.name} className="object-cover w-full h-full" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                                                <div className="absolute bottom-4 left-4">
                                                    <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg text-xs inline-block">
                                                        {channel.category}
                                                    </div>
                                                    <h3 className="text-lg font-medium mt-1">{channel.name}</h3>
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                <div className="grid grid-cols-3 gap-2 mb-4">
                                                    <div className="bg-white/5 rounded-lg p-2 text-center">
                                                        <p className="text-xs text-white/60">Ownership</p>
                                                        <p className="text-sm font-medium">{channel.ownedShares}%</p>
                                                    </div>
                                                    <div className="bg-white/5 rounded-lg p-2 text-center">
                                                        <p className="text-xs text-white/60">Value</p>
                                                        <p className="text-sm font-medium">{channel.totalValue} S</p>
                                                    </div>
                                                    <div className="bg-white/5 rounded-lg p-2 text-center">
                                                        <p className="text-xs text-white/60">Pending</p>
                                                        <p className="text-sm font-medium text-emerald-400">{channel.pendingRevenue} S</p>
                                                    </div>
                                                </div>

                                                <div className="flex space-x-2">
                                                    <button className="flex-1 py-2 rounded-lg bg-[#37E8FF]/10 text-[#37E8FF] text-sm font-medium hover:bg-[#37E8FF]/20 transition-colors">
                                                        Manage
                                                    </button>
                                                    {channel.pendingRevenue > 0 && (
                                                        <button
                                                            className="flex-1 py-2 rounded-lg bg-emerald-400/10 text-emerald-400 text-sm font-medium hover:bg-emerald-400/20 transition-colors"
                                                            onClick={() => handleClaimRevenue(channel.id)}
                                                        >
                                                            Claim Revenue
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-white/5">
                                    <div className="w-16 h-16 rounded-full bg-[#1A1A24] mx-auto flex items-center justify-center mb-4">
                                        <Plus size={24} className="text-white/50" />
                                    </div>
                                    <p className="text-white/60 mb-4">You haven't created any channels yet</p>
                                    <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white font-medium hover:opacity-90 transition-opacity">
                                        Create Your First Channel
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Owned Shares Tab */}
                    {activeTab === 'owned shares' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-medium">Owned Shares</h2>
                                <button className="px-4 py-2 rounded-lg bg-[#1A1A24] text-white text-sm font-medium border border-white/10 hover:border-white/20 transition-colors">
                                    Explore Channels
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...profileData.createdChannels, ...profileData.ownedShares].map((channel) => (
                                    <div key={channel.id} className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A10] rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors">
                                        <div className="relative">
                                            <img src={channel.image} alt={channel.name} className="object-cover w-full h-40" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                                            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs">
                                                {channel.ownedShares}% Owned
                                            </div>
                                            <div className="absolute bottom-3 left-3">
                                                <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg text-xs inline-block">
                                                    {channel.category}
                                                </div>
                                                <h3 className="text-base font-medium mt-1">{channel.name}</h3>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="mb-3">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-white/60">Ownership</span>
                                                    <span className="text-white">{channel.ownedShares}%</span>
                                                </div>
                                                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]"
                                                        style={{ width: `${channel.ownedShares}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 mb-4">
                                                <div className="bg-white/5 rounded-lg p-2 text-center">
                                                    <p className="text-xs text-white/60">Value</p>
                                                    <p className="text-sm font-medium">{channel.totalValue} S</p>
                                                </div>
                                                <div className="bg-white/5 rounded-lg p-2 text-center">
                                                    <p className="text-xs text-white/60">Pending</p>
                                                    <p className="text-sm font-medium text-emerald-400">{channel.pendingRevenue} S</p>
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                {channel.pendingRevenue > 0 && (
                                                    <button
                                                        className="flex-1 py-2 rounded-lg bg-emerald-400/10 text-emerald-400 text-sm font-medium hover:bg-emerald-400/20 transition-colors"
                                                        onClick={() => handleClaimRevenue(channel.id)}
                                                    >
                                                        Claim Revenue
                                                    </button>
                                                )}
                                                <button className="flex-1 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/15 transition-colors">
                                                    Sell Shares
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Listings Tab */}
                    {activeTab === 'listings' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-medium">Marketplace Listings</h2>
                                <div className="flex space-x-2">
                                    <button className="px-4 py-2 rounded-lg bg-[#37E8FF]/10 text-[#37E8FF] text-sm font-medium hover:bg-[#37E8FF]/20 transition-colors">
                                        My Listings
                                    </button>
                                    <button className="px-4 py-2 rounded-lg bg-[#1A1A24] text-white text-sm font-medium border border-white/10 hover:border-white/20 transition-colors">
                                        Browse Market
                                    </button>
                                </div>
                            </div>

                            {profileData.listings.length > 0 ? (
                                <div className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A10] rounded-2xl border border-white/5 overflow-hidden">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium mb-4">My Active Listings</h3>

                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-white/10">
                                                        <th className="text-left text-xs text-white/60 pb-3">Channel</th>
                                                        <th className="text-right text-xs text-white/60 pb-3">Amount</th>
                                                        <th className="text-right text-xs text-white/60 pb-3">Price/Share</th>
                                                        <th className="text-right text-xs text-white/60 pb-3">Total Price</th>
                                                        <th className="text-right text-xs text-white/60 pb-3">Listed</th>
                                                        <th className="text-right text-xs text-white/60 pb-3">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {profileData.listings.map(listing => (
                                                        <tr key={listing.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                            <td className="py-4">
                                                                <div className="text-sm font-medium">{listing.channelName}</div>
                                                            </td>
                                                            <td className="text-right py-4">
                                                                <div className="text-sm">{listing.amount}%</div>
                                                            </td>
                                                            <td className="text-right py-4">
                                                                <div className="text-sm">{listing.pricePerShare} S</div>
                                                            </td>
                                                            <td className="text-right py-4">
                                                                <div className="text-sm">{listing.totalPrice} S</div>
                                                            </td>
                                                            <td className="text-right py-4">
                                                                <div className="text-sm text-white/60">{listing.listed}</div>
                                                            </td>
                                                            <td className="text-right py-4">
                                                                <button className="text-[#FF3D8A] text-sm hover:text-[#FF3D8A]/80 transition-colors">
                                                                    Cancel
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-16 border border-dashed border-white/10 rounded-xl bg-white/5">
                                    <div className="w-16 h-16 rounded-full bg-[#1A1A24] mx-auto flex items-center justify-center mb-3">
                                        <Wallet size={24} className="text-white/50" />
                                    </div>
                                    <p className="text-white/60 mb-4">You don't have any active listings</p>
                                    <button className="px-6 py-3 rounded-lg bg-[#1A1A24] text-white font-medium border border-white/10 hover:border-white/20 transition-colors">
                                        Create New Listing
                                    </button>
                                </div>
                            )}

                            <div className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A10] rounded-2xl border border-white/5 overflow-hidden">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium mb-4">Create New Listing</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-white/70 mb-2">Select Channel</label>
                                                <select className="w-full bg-[#0A0A10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#37E8FF]">
                                                    <option>-- Select Channel --</option>
                                                    {profileData.createdChannels.map(channel => (
                                                        <option key={channel.id} value={channel.id}>{channel.name} ({channel.ownedShares}%)</option>
                                                    ))}
                                                    {profileData.ownedShares.map(channel => (
                                                        <option key={channel.id} value={channel.id}>{channel.name} ({channel.ownedShares}%)</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm text-white/70 mb-2">Amount to Sell (%)</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-[#0A0A10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#37E8FF]"
                                                    placeholder="Enter amount"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-white/70 mb-2">Price per Share (S)</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-[#0A0A10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#37E8FF]"
                                                    placeholder="Enter price"
                                                />
                                            </div>

                                            <div className="pt-8">
                                                <button className="w-full py-3 rounded-lg bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white font-medium hover:opacity-90 transition-opacity">
                                                    Create Listing
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Governance Tab */}
                    {activeTab === 'governance' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-medium">Governance</h2>
                                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center">
                                    <Plus size={16} className="mr-1" /> Create Proposal
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A10] rounded-2xl border border-white/5 overflow-hidden">
                                        <div className="p-6">
                                            <h3 className="text-lg font-medium mb-4">Active Proposals</h3>

                                            {profileData.proposals.filter(p => p.status === 'active').length > 0 ? (
                                                <div className="space-y-6">
                                                    {profileData.proposals
                                                        .filter(p => p.status === 'active')
                                                        .map(proposal => (
                                                            <div key={proposal.id} className="border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
                                                                <div className="flex justify-between items-start mb-3">
                                                                    <div>
                                                                        <h3 className="text-base font-medium">{proposal.description}</h3>
                                                                        <p className="text-sm text-white/60 mt-1">Channel: {proposal.channelName}</p>
                                                                    </div>
                                                                    <div className="bg-[#37E8FF]/20 text-[#37E8FF] px-3 py-1 rounded-full text-xs">
                                                                        {proposal.endTime}
                                                                    </div>
                                                                </div>

                                                                <div className="mb-4">
                                                                    <div className="flex justify-between text-xs mb-1">
                                                                        <span className="text-[#37E8FF]">For: {proposal.votesFor}%</span>
                                                                        <span className="text-[#FF3D8A]">Against: {proposal.votesAgainst}%</span>
                                                                    </div>
                                                                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                                                                        <div
                                                                            className="h-full rounded-full bg-[#37E8FF]"
                                                                            style={{ width: `${proposal.votesFor}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-wrap md:flex-nowrap space-y-2 md:space-y-0 md:space-x-2">
                                                                    <button className="w-full md:w-auto flex-1 py-2 rounded-lg bg-[#37E8FF]/10 text-[#37E8FF] text-sm font-medium hover:bg-[#37E8FF]/20 transition-colors">
                                                                        Vote For
                                                                    </button>
                                                                    <button className="w-full md:w-auto flex-1 py-2 rounded-lg bg-[#FF3D8A]/10 text-[#FF3D8A] text-sm font-medium hover:bg-[#FF3D8A]/20 transition-colors">
                                                                        Vote Against
                                                                    </button>
                                                                    <button className="w-full md:w-auto flex-1 py-2 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/15 transition-colors">
                                                                        View Details
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/5">
                                                    <p className="text-white/60">No active proposals</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A10] rounded-2xl border border-white/5 overflow-hidden">
                                        <div className="p-6">
                                            <h3 className="text-lg font-medium mb-4">Past Proposals</h3>

                                            {profileData.proposals.filter(p => p.status === 'passed').length > 0 ? (
                                                <div className="space-y-4">
                                                    {profileData.proposals
                                                        .filter(p => p.status === 'passed')
                                                        .map(proposal => (
                                                            <div key={proposal.id} className="border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h3 className="text-base font-medium">{proposal.description}</h3>
                                                                        <p className="text-sm text-white/60 mt-1">Channel: {proposal.channelName}</p>
                                                                    </div>
                                                                    <div className="bg-emerald-400/20 text-emerald-400 px-3 py-1 rounded-full text-xs">
                                                                        Passed
                                                                    </div>
                                                                </div>

                                                                <div className="mt-3 flex justify-between text-xs text-white/60">
                                                                    <span>Votes For: {proposal.votesFor}%</span>
                                                                    <span>Votes Against: {proposal.votesAgainst}%</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 border border-dashed border-white/10 rounded-xl bg-white/5">
                                                    <p className="text-white/60">No past proposals</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A10] rounded-2xl border border-white/5 overflow-hidden">
                                        <div className="p-6">
                                            <h3 className="text-lg font-medium mb-4">Governance Stats</h3>

                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                                    <p className="text-xs text-white/60 mb-1">Proposals Voted</p>
                                                    <p className="text-2xl font-medium">{profileData.votedProposals}</p>
                                                </div>
                                                <div className="bg-white/5 rounded-xl p-4 text-center">
                                                    <p className="text-xs text-white/60 mb-1">Active Proposals</p>
                                                    <p className="text-2xl font-medium">{profileData.proposals.filter(p => p.status === 'active').length}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-sm font-medium text-white/70">My Channels</h4>
                                                {profileData.createdChannels.map(channel => (
                                                    <div key={channel.id} className="flex justify-between items-center p-3 border border-white/5 rounded-lg hover:border-white/10 transition-colors bg-black/20">
                                                        <span className="text-sm">{channel.name}</span>
                                                        <button className="text-xs px-3 py-1 rounded-lg bg-[#37E8FF]/10 text-[#37E8FF] hover:bg-[#37E8FF]/20 transition-colors">
                                                            Create Proposal
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A10] rounded-2xl border border-white/5 overflow-hidden">
                                        <div className="p-6">
                                            <h3 className="text-lg font-medium mb-4">Create New Proposal</h3>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm text-white/70 mb-2">Select Channel</label>
                                                    <select className="w-full bg-[#0A0A10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#37E8FF]">
                                                        <option>-- Select Channel --</option>
                                                        {profileData.createdChannels.map(channel => (
                                                            <option key={channel.id} value={channel.id}>{channel.name}</option>
                                                        ))}
                                                        {profileData.ownedShares.map(channel => (
                                                            <option key={channel.id} value={channel.id}>{channel.name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm text-white/70 mb-2">Description</label>
                                                    <textarea
                                                        className="w-full bg-[#0A0A10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#37E8FF] h-24"
                                                        placeholder="Describe your proposal"
                                                    ></textarea>
                                                </div>

                                                <div>
                                                    <label className="block text-sm text-white/70 mb-2">Content URI</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-[#0A0A10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#37E8FF]"
                                                        placeholder="IPFS URI for content"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm text-white/70 mb-2">Voting Period (seconds)</label>
                                                    <input
                                                        type="number"
                                                        className="w-full bg-[#0A0A10] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#37E8FF]"
                                                        placeholder="Minimum: 3600 seconds (1 hour)"
                                                        defaultValue="86400"
                                                    />
                                                </div>

                                                <button className="w-full py-3 rounded-lg bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white font-medium hover:opacity-90 transition-opacity">
                                                    Create Proposal
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sonic Blockchain Label */}
            <div className="fixed bottom-6 right-6 bg-[#1A1A24]/80 backdrop-blur-md px-4 py-2 rounded-lg border border-[#37E8FF]/30 shadow-glow-sm flex items-center">
                <div className="w-2 h-2 bg-[#37E8FF] rounded-full animate-pulse mr-2"></div>
                <span className="text-xs font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                    Powered by Sonic Blockchain
                </span>
            </div>
        </div>
    );
};

export default ProfilePage;