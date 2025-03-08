"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AppNavBar from '@/components/layout/AppNavBar';
import Link from 'next/link';
import { useWallet } from '@/context/WalletContext';
import { useGovernance, useChannelNFT } from '@/hooks/useContract';
import { ethers } from 'ethers';

// Background animation component
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

// Proposal Card Component
const ProposalCard = ({ proposal, onVote, hasVoted, userShares, isConnected }) => {
    const router = useRouter();

    // Format timestamp to date
    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Calculate time left for voting
    const calculateTimeLeft = (endTime) => {
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = endTime - now;

        if (timeLeft <= 0) return 'Voting ended';

        const days = Math.floor(timeLeft / (60 * 60 * 24));
        const hours = Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60));

        if (days > 0) return `${days}d ${hours}h left`;

        const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
        if (hours > 0) return `${hours}h ${minutes}m left`;

        return `${minutes}m left`;
    };

    // Calculate vote percentages
    const totalVotes = proposal.forVotes + proposal.againstVotes;
    const forPercentage = totalVotes > 0 ? Math.round((proposal.forVotes / totalVotes) * 100) : 0;
    const againstPercentage = totalVotes > 0 ? Math.round((proposal.againstVotes / totalVotes) * 100) : 0;

    // Determine proposal status
    const isVotingOpen = Math.floor(Date.now() / 1000) < proposal.endTime;
    const isVotingClosed = !isVotingOpen;
    const canVote = isConnected && isVotingOpen && !hasVoted && userShares > 0;

    // Determine status tag properties
    let statusTag;
    if (proposal.executed) {
        statusTag = {
            text: proposal.passed ? 'Passed' : 'Failed',
            color: proposal.passed ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
        };
    } else if (isVotingClosed) {
        statusTag = {
            text: 'Ready for execution',
            color: 'bg-yellow-500/20 text-yellow-500'
        };
    } else {
        statusTag = {
            text: 'Voting Active',
            color: 'bg-[#37E8FF]/20 text-[#37E8FF]'
        };
    }

    return (
        <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-[#37E8FF]/20 transition-all">
            {/* Proposal Header */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-xl">{proposal.description}</h3>
                    <div className={`px-2.5 py-1 rounded-full text-xs ${statusTag.color}`}>
                        {statusTag.text}
                    </div>
                </div>

                <div className="flex items-center text-white/60 text-sm mb-4">
                    <div className="flex items-center mr-4">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Started: {formatDate(proposal.startTime)}</span>
                    </div>

                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{calculateTimeLeft(proposal.endTime)}</span>
                    </div>
                </div>

                {/* Proposal Details */}
                <div className="mb-6">
                    <div className="flex items-center mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#121218] flex items-center justify-center mr-2">
                            <svg className="w-3 h-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <span className="text-white/70 text-sm">Proposed by {proposal.proposer.substring(0, 6)}...{proposal.proposer.substring(proposal.proposer.length - 4)}</span>
                    </div>

                    <a
                        href={proposal.contentUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#37E8FF] text-sm flex items-center hover:underline"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Proposal Content
                    </a>
                </div>

                {/* Voting Results */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/70">Votes</span>
                        <span className="font-medium">{totalVotes} total</span>
                    </div>

                    <div className="h-2 w-full bg-[#121218] rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-gradient-to-r from-[#37E8FF] to-[#37E8FF]/70" style={{ width: `${forPercentage}%` }}></div>
                    </div>

                    <div className="flex justify-between text-xs">
                        <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-[#37E8FF] mr-1.5"></div>
                            <span className="text-white/70">For: {forPercentage}% ({proposal.forVotes} votes)</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-white/40 mr-1.5"></div>
                            <span className="text-white/70">Against: {againstPercentage}% ({proposal.againstVotes} votes)</span>
                        </div>
                    </div>
                </div>

                {/* Voting Actions */}
                {isVotingOpen && (
                    <div className={`border-t border-white/10 pt-4 ${!canVote ? 'opacity-50' : ''}`}>
                        {hasVoted ? (
                            <div className="text-center text-white/70 text-sm py-1">You have already voted on this proposal</div>
                        ) : userShares <= 0 ? (
                            <div className="text-center text-white/70 text-sm py-1">You need channel shares to vote</div>
                        ) : !isConnected ? (
                            <div className="text-center text-white/70 text-sm py-1">Connect wallet to vote</div>
                        ) : (
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => onVote(proposal.id, true)}
                                    disabled={!canVote}
                                    className="flex-1 py-2 bg-[#37E8FF]/20 text-[#37E8FF] rounded-lg font-medium text-sm hover:bg-[#37E8FF]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Vote For
                                </button>
                                <button
                                    onClick={() => onVote(proposal.id, false)}
                                    disabled={!canVote}
                                    className="flex-1 py-2 bg-white/10 text-white rounded-lg font-medium text-sm hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Vote Against
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Execute Proposal */}
                {isVotingClosed && !proposal.executed && isConnected && (
                    <div className="border-t border-white/10 pt-4">
                        <button
                            onClick={() => onVote(proposal.id, null, true)}
                            className="w-full py-2 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-lg font-medium text-sm hover:shadow-glow transition-all"
                        >
                            Execute Proposal
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Create Proposal Form Component
const CreateProposalForm = ({ channelId, userShares, totalShares, proposalThreshold, onCreateProposal }) => {
    const [description, setDescription] = useState('');
    const [contentUri, setContentUri] = useState('');
    const [votingPeriod, setVotingPeriod] = useState('86400'); // Default: 1 day in seconds
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate if user meets threshold
    const userSharePercentage = (userShares / totalShares) * 10000; // In basis points (100% = 10000)
    const meetsThreshold = userSharePercentage >= proposalThreshold;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!meetsThreshold) return;

        setIsSubmitting(true);

        try {
            await onCreateProposal(description, contentUri, parseInt(votingPeriod));

            // Reset form on success
            setDescription('');
            setContentUri('');
            setVotingPeriod('86400');
        } catch (error) {
            console.error("Error creating proposal:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-xl p-5">
            <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                Create New Proposal
            </h3>

            {!meetsThreshold ? (
                <div className="bg-[#121218] rounded-lg p-4 mb-4">
                    <div className="flex items-center text-yellow-400 mb-2">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="font-medium">Threshold Not Met</span>
                    </div>
                    <p className="text-white/70 text-sm">
                        You need at least {proposalThreshold / 100}% of shares to create a proposal.
                        You currently own {(userSharePercentage / 100).toFixed(2)}% of shares.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-white/70 text-sm mb-1">Proposal Title</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter proposal title"
                            required
                            className="w-full px-4 py-2 bg-[#121218] rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm mb-1">Content URI (IPFS or Other Link)</label>
                        <input
                            type="text"
                            value={contentUri}
                            onChange={(e) => setContentUri(e.target.value)}
                            placeholder="ipfs://... or https://..."
                            required
                            className="w-full px-4 py-2 bg-[#121218] rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white"
                        />
                        <p className="text-white/50 text-xs mt-1">
                            Link to detailed proposal content (IPFS recommended)
                        </p>
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm mb-1">Voting Period</label>
                        <select
                            value={votingPeriod}
                            onChange={(e) => setVotingPeriod(e.target.value)}
                            className="w-full px-4 py-2 bg-[#121218] rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white"
                        >
                            <option value="3600">1 hour</option>
                            <option value="86400">1 day</option>
                            <option value="259200">3 days</option>
                            <option value="604800">1 week</option>
                            <option value="1209600">2 weeks</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !meetsThreshold}
                        className="w-full py-3 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-lg font-medium hover:shadow-glow transition-all disabled:opacity-70"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Proposal'}
                    </button>
                </form>
            )}
        </div>
    );
};

// Main Governance Page Component
export default function GovernancePage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const channelId = searchParams.get('channel');
    const { isConnected, account } = useWallet();

    // Hooks for accessing the smart contracts
    const { contract: governanceContract, loading: governanceLoading } = useGovernance();
    const { contract: channelNFTContract, loading: channelLoading } = useChannelNFT();

    // State variables
    const [channel, setChannel] = useState(null);
    const [proposals, setProposals] = useState([]);
    const [proposalDetails, setProposalDetails] = useState({});
    const [userVotes, setUserVotes] = useState({});
    const [userShares, setUserShares] = useState(0);
    const [totalShares, setTotalShares] = useState(0);
    const [activeFilter, setActiveFilter] = useState('all');
    const [proposalThreshold, setProposalThreshold] = useState(500); // Default: 5% in basis points
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Redirect if no channel ID is provided
    useEffect(() => {
        if (!channelId) {
            router.push('/channels');
        }
    }, [channelId, router]);

    // Fetch channel data and proposal data
    useEffect(() => {
        const fetchData = async () => {
            if (!channelId || !channelNFTContract || !governanceContract || governanceLoading || channelLoading) {
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Fetch channel details
                const channelDetails = await channelNFTContract.getChannel(channelId);
                setChannel({
                    id: channelId,
                    name: channelDetails.name,
                    description: channelDetails.description,
                    category: channelDetails.category,
                    creator: channelDetails.creator,
                    totalShares: channelDetails.totalShares,
                    createdAt: channelDetails.createdAt,
                    active: channelDetails.active
                });

                // Fetch total shares
                const shares = await channelNFTContract.getTotalShares(channelId);
                setTotalShares(parseInt(shares.toString()));

                // Fetch user shares if connected
                if (isConnected && account) {
                    const userShareBalance = await channelNFTContract.balanceOf(account, channelId);
                    setUserShares(parseInt(userShareBalance.toString()));
                }

                // Fetch governance proposal threshold
                const threshold = await governanceContract.proposalThreshold();
                setProposalThreshold(parseInt(threshold.toString()));

                // Fetch all proposals for this channel
                const proposalIds = await governanceContract.getChannelProposals(channelId);
                setProposals(proposalIds.map(id => parseInt(id.toString())));

                // Fetch details for each proposal
                const details = {};
                const votes = {};

                await Promise.all(
                    proposalIds.map(async (id) => {
                        // Get proposal details
                        const proposal = await governanceContract.getProposalDetails(id);
                        details[id.toString()] = {
                            id: id,
                            channelId: parseInt(proposal.channelId.toString()),
                            description: proposal.description,
                            contentUri: proposal.contentUri,
                            startTime: parseInt(proposal.startTime.toString()),
                            endTime: parseInt(proposal.endTime.toString()),
                            proposer: proposal.proposer,
                            forVotes: parseInt(proposal.forVotes.toString()),
                            againstVotes: parseInt(proposal.againstVotes.toString()),
                            executed: proposal.executed,
                            passed: proposal.passed
                        };

                        // Check if user has voted if connected
                        if (isConnected && account) {
                            const hasVoted = await governanceContract.hasVoted(id, account);
                            votes[id.toString()] = hasVoted;
                        }
                    })
                );

                setProposalDetails(details);
                setUserVotes(votes);
            } catch (err) {
                console.error("Error fetching governance data:", err);
                setError("Failed to load governance data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [channelId, channelNFTContract, governanceContract, governanceLoading, channelLoading, isConnected, account]);

    // Handle voting on a proposal
    const handleVote = async (proposalId, support, isExecution = false) => {
        if (!isConnected || !governanceContract) return;

        try {
            let tx;

            if (isExecution) {
                // Execute proposal
                tx = await governanceContract.executeProposal(proposalId);
            } else {
                // Cast vote
                tx = await governanceContract.castVote(proposalId, support);
            }

            await tx.wait();

            // Update UI
            if (isExecution) {
                // Update executed status
                setProposalDetails(prev => ({
                    ...prev,
                    [proposalId]: {
                        ...prev[proposalId],
                        executed: true,
                        // We don't know if it passed yet, will be updated on next fetch
                    }
                }));
            } else {
                // Update user vote status
                setUserVotes(prev => ({
                    ...prev,
                    [proposalId]: true
                }));

                // Update vote counts (simple approximation, will be properly updated on next fetch)
                const voteWeight = userShares;
                setProposalDetails(prev => ({
                    ...prev,
                    [proposalId]: {
                        ...prev[proposalId],
                        forVotes: support
                            ? prev[proposalId].forVotes + voteWeight
                            : prev[proposalId].forVotes,
                        againstVotes: !support
                            ? prev[proposalId].againstVotes + voteWeight
                            : prev[proposalId].againstVotes
                    }
                }));
            }
        } catch (error) {
            console.error(`Error ${isExecution ? 'executing' : 'voting on'} proposal:`, error);
            alert(`Failed to ${isExecution ? 'execute' : 'vote on'} proposal. See console for details.`);
        }
    };

    // Handle creating a new proposal
    const handleCreateProposal = async (description, contentUri, votingPeriod) => {
        if (!isConnected || !governanceContract || !channelId) return;

        try {
            const tx = await governanceContract.createProposal(
                channelId,
                description,
                contentUri,
                votingPeriod
            );

            await tx.wait();

            // Refresh proposal list
            const proposalIds = await governanceContract.getChannelProposals(channelId);
            setProposals(proposalIds.map(id => parseInt(id.toString())));

            // Get details of the new proposal
            const newProposalId = proposalIds[proposalIds.length - 1];
            const proposal = await governanceContract.getProposalDetails(newProposalId);

            // Update proposal details
            setProposalDetails(prev => ({
                ...prev,
                [newProposalId.toString()]: {
                    id: newProposalId,
                    channelId: parseInt(proposal.channelId.toString()),
                    description: proposal.description,
                    contentUri: proposal.contentUri,
                    startTime: parseInt(proposal.startTime.toString()),
                    endTime: parseInt(proposal.endTime.toString()),
                    proposer: proposal.proposer,
                    forVotes: parseInt(proposal.forVotes.toString()),
                    againstVotes: parseInt(proposal.againstVotes.toString()),
                    executed: proposal.executed,
                    passed: proposal.passed
                }
            }));

            return true;
        } catch (error) {
            console.error("Error creating proposal:", error);
            alert("Failed to create proposal. See console for details.");
            return false;
        }
    };

    // Filter proposals based on active filter
    const filteredProposals = Object.values(proposalDetails).filter(proposal => {
        const now = Math.floor(Date.now() / 1000);
        const isVotingOpen = now < proposal.endTime;

        switch (activeFilter) {
            case 'active':
                return isVotingOpen && !proposal.executed;
            case 'executed':
                return proposal.executed;
            case 'pending':
                return !isVotingOpen && !proposal.executed;
            default:
                return true;
        }
    }).sort((a, b) => {
        // Sort by status (active first), then by newest
        const aVotingOpen = Math.floor(Date.now() / 1000) < a.endTime;
        const bVotingOpen = Math.floor(Date.now() / 1000) < b.endTime;

        if (aVotingOpen && !bVotingOpen) return -1;
        if (!aVotingOpen && bVotingOpen) return 1;

        return b.startTime - a.startTime;
    });

    // Return loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#121218] text-white relative">
                <BackgroundAnimation />
                <AppNavBar />

                <main className="max-w-screen-xl mx-auto px-4 py-12">
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-[#37E8FF] animate-spin mb-4"></div>
                        <p className="text-white/70">Loading governance data...</p>
                    </div>
                </main>
            </div>
        );
    }

    // Return error state
    if (error) {
        return (
            <div className="min-h-screen bg-[#121218] text-white relative">
                <BackgroundAnimation />
                <AppNavBar />

                <main className="max-w-screen-xl mx-auto px-4 py-12">
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="bg-red-500/20 text-red-500 p-4 rounded-lg mb-4">
                            {error}
                        </div>
                        <Link
                            href="/channels"
                            className="px-6 py-3 bg-[#1A1A24] border border-white/10 rounded-full hover:border-[#37E8FF]/30 transition-all"
                        >
                            Return to Channels
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121218] text-white relative">
            <BackgroundAnimation />
            <AppNavBar />

            <main className="max-w-screen-xl mx-auto px-4 py-12">
                {/* Channel Header Section */}
                <div className="mb-8">
                    <Link
                        href={`/channels`}
                        className="inline-flex items-center text-white/70 hover:text-white mb-4"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Channels
                    </Link>

                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#37E8FF]/20 to-[#FF3D8A]/20 flex items-center justify-center mr-3 border border-white/10">
                            <span className="font-bold text-white">#{channelId}</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">
                                {channel?.name} <span className="text-white/50">Governance</span>
                            </h1>
                            <div className="flex items-center text-white/70 text-sm">
                                <div className="px-2 py-0.5 rounded-full bg-[#121218] border border-white/10 mr-2">
                                    {channel?.category}
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>{channel?.creator.substring(0, 6)}...{channel?.creator.substring(channel.creator.length - 4)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-[#1A1A24]/60 backdrop-blur-sm rounded-lg p-4 border border-white/5">
                            <div className="text-white/60 text-xs mb-1">Total Shares</div>
                            <div className="text-lg font-bold">{totalShares}</div>
                        </div>

                        <div className="bg-[#1A1A24]/60 backdrop-blur-sm rounded-lg p-4 border border-white/5">
                            <div className="text-white/60 text-xs mb-1">Your Shares</div>
                            <div className="flex items-end">
                                <div className="text-lg font-bold mr-1">{userShares}</div>
                                <div className="text-white/60 text-xs">({((userShares / totalShares) * 100).toFixed(2)}%)</div>
                            </div>
                        </div>

                        <div className="bg-[#1A1A24]/60 backdrop-blur-sm rounded-lg p-4 border border-white/5">
                            <div className="text-white/60 text-xs mb-1">Proposal Threshold</div>
                            <div className="text-lg font-bold">{(proposalThreshold / 100).toFixed(1)}%</div>
                        </div>

                        <div className="bg-[#1A1A24]/60 backdrop-blur-sm rounded-lg p-4 border border-white/5">
                            <div className="text-white/60 text-xs mb-1">Total Proposals</div>
                            <div className="text-lg font-bold">{proposals.length}</div>
                        </div>
                    </div>

                    <div className="h-px w-full bg-white/10 mb-6"></div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Proposals Column */}
                    <div className="lg:col-span-2">
                        {/* Filter Tabs */}
                        <div className="flex mb-6 border-b border-white/10">
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={`px-4 py-2 text-sm font-medium ${activeFilter === 'all' ? 'text-white border-b-2 border-[#37E8FF]' : 'text-white/60 hover:text-white'}`}
                            >
                                All Proposals
                            </button>
                            <button
                                onClick={() => setActiveFilter('active')}
                                className={`px-4 py-2 text-sm font-medium ${activeFilter === 'active' ? 'text-white border-b-2 border-[#37E8FF]' : 'text-white/60 hover:text-white'}`}
                            >
                                Active Voting
                            </button>
                            <button
                                onClick={() => setActiveFilter('pending')}
                                className={`px-4 py-2 text-sm font-medium ${activeFilter === 'pending' ? 'text-white border-b-2 border-[#37E8FF]' : 'text-white/60 hover:text-white'}`}
                            >
                                Pending Execution
                            </button>
                            <button
                                onClick={() => setActiveFilter('executed')}
                                className={`px-4 py-2 text-sm font-medium ${activeFilter === 'executed' ? 'text-white border-b-2 border-[#37E8FF]' : 'text-white/60 hover:text-white'}`}
                            >
                                Executed
                            </button>
                        </div>

                        {/* Proposals List */}
                        {filteredProposals.length > 0 ? (
                            <div className="space-y-6">
                                {filteredProposals.map(proposal => (
                                    <ProposalCard
                                        key={proposal.id}
                                        proposal={proposal}
                                        onVote={handleVote}
                                        hasVoted={userVotes[proposal.id.toString()]}
                                        userShares={userShares}
                                        isConnected={isConnected}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
                                <svg className="w-12 h-12 text-white/30 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="text-lg font-medium mb-2">No proposals found</h3>
                                <p className="text-white/60 mb-4">
                                    {activeFilter !== 'all'
                                        ? `There are no ${activeFilter} proposals for this channel.`
                                        : 'This channel does not have any proposals yet.'}
                                </p>
                                {activeFilter !== 'all' && (
                                    <button
                                        onClick={() => setActiveFilter('all')}
                                        className="px-4 py-2 bg-[#121218] border border-white/10 rounded-lg text-sm hover:border-[#37E8FF]/30"
                                    >
                                        Show all proposals
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Create Proposal Form */}
                        <CreateProposalForm
                            channelId={parseInt(channelId)}
                            userShares={userShares}
                            totalShares={totalShares}
                            proposalThreshold={proposalThreshold}
                            onCreateProposal={handleCreateProposal}
                        />

                        {/* Governance Info Card */}
                        <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                            <h3 className="text-lg font-bold mb-4">About Governance</h3>

                            <div className="space-y-4 text-white/70 text-sm">
                                <p>
                                    Channel governance allows stakeholders to collectively make decisions about content direction and channel operations.
                                </p>

                                <div className="bg-[#121218] rounded-lg p-4">
                                    <h4 className="font-medium mb-2">How It Works</h4>
                                    <ol className="list-decimal list-inside space-y-2">
                                        <li>Stakeholders with sufficient shares can create proposals</li>
                                        <li>All shareholders can vote with voting power proportional to their stake</li>
                                        <li>After voting period ends, proposals can be executed</li>
                                        <li>Passed proposals will be implemented by the channel's AI algorithms</li>
                                    </ol>
                                </div>

                                <div className="bg-[#121218] rounded-lg p-4">
                                    <h4 className="font-medium mb-2">Proposal Thresholds</h4>
                                    <ul className="space-y-2">
                                        <li>Create proposal: <span className="font-medium">{(proposalThreshold / 100).toFixed(1)}% of shares</span></li>
                                        <li>Voting period: <span className="font-medium">Minimum 1 hour</span></li>
                                        <li>Execution: <span className="font-medium">Simple majority (>50%)</span></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-4">
                                <Link
                                    href={`/channels?id=${channelId}`}
                                    className="inline-flex items-center text-[#37E8FF] hover:underline"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    View Channel Details
                                </Link>
                            </div>
                        </div>

                        {/* Actions Card */}
                        {isConnected ? (
                            <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                                <h3 className="text-lg font-bold mb-4">Channel Actions</h3>

                                <div className="space-y-3">
                                    <Link
                                        href={`/marketplace?channel=${channelId}`}
                                        className="block w-full py-3 px-4 bg-[#121218] border border-white/10 rounded-lg text-center hover:border-[#37E8FF]/30 transition-all"
                                    >
                                        Trade Channel Shares
                                    </Link>
                                    {channel?.creator.toLowerCase() === account?.toLowerCase() && (
                                        <button
                                            className="block w-full py-3 px-4 bg-[#121218] border border-white/10 rounded-lg text-center hover:border-[#37E8FF]/30 transition-all"
                                        >
                                            Manage Channel Settings
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-xl p-5">
                                <h3 className="text-lg font-bold mb-4">Connect Wallet</h3>
                                <p className="text-white/70 text-sm mb-4">
                                    Connect your wallet to participate in governance and vote on proposals.
                                </p>
                                <button
                                    className="w-full py-3 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-lg font-medium hover:shadow-glow transition-all"
                                >
                                    Connect Wallet
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}