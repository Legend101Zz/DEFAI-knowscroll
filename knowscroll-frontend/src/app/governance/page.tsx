/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AppNavBar from '@/components/layout/AppNavBar';
import { useWallet } from '@/context/WalletContext';
import { useChannelNFT, useGovernance } from '@/hooks/useContract';
import { TESTNET_CHAIN_ID } from '@/lib/contracts/addresses';
import Link from 'next/link';

// Background animation component
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

// Types
interface Channel {
    id: number;
    name: string;
    description: string;
    category: string;
    creator: string;
    totalShares: number;
    userShares?: number;
    userSharePercentage?: number;
    votingPower?: number;
}

interface Proposal {
    id: number;
    channelId: number;
    description: string;
    contentUri: string;
    startTime: number;
    endTime: number;
    proposer: string;
    forVotes: number;
    againstVotes: number;
    executed: boolean;
    passed: boolean;
    hasVoted?: boolean;
    status: 'active' | 'ended' | 'executed';
    forPercentage: number;
    againstPercentage: number;
}

// Channel Selector Component
const ChannelSelector = ({
    channels,
    selectedChannelId,
    onSelect,
    loading
}: {
    channels: Channel[];
    selectedChannelId?: number;
    onSelect: (channelId: number) => void;
    loading: boolean;
}) => {
    if (loading) {
        return (
            <div className="p-4 text-center">
                <div className="w-8 h-8 border-t-2 border-b-2 border-[#37E8FF] rounded-full animate-spin mx-auto mb-2"></div>
                <div className="text-white/70 text-sm">Loading your channels...</div>
            </div>
        );
    }

    if (channels.length === 0) {
        return (
            <div className="p-4 text-center">
                <p className="text-white/70 mb-4">You don&apos;t own shares in any channels.</p>
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
        <div className="space-y-2">
            {channels.map(channel => (
                <button
                    key={channel.id}
                    onClick={() => onSelect(channel.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-all border text-left ${selectedChannelId === channel.id
                        ? 'bg-[#1A1A24] border-[#37E8FF]/30'
                        : 'bg-[#121218]/80 border-white/5 hover:border-white/20'
                        }`}
                >
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#37E8FF]/20 to-[#FF3D8A]/20 flex items-center justify-center mr-3">
                        <span className="text-white/90 font-medium">#{channel.id}</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="font-medium truncate">{channel.name}</div>
                        <div className="text-xs text-white/50">Voting Power: {channel.votingPower?.toFixed(2) || 0}%</div>
                    </div>
                </button>
            ))}
        </div>
    );
};

// Proposal Card Component
const ProposalCard = ({
    proposal,
    onVote,
    onExecute,
    isVoting,
    isExecuting,
    votedProposalId
}: {
    proposal: Proposal;
    onVote: (proposalId: number, support: boolean) => void;
    onExecute: (proposalId: number) => void;
    isVoting: boolean;
    isExecuting: boolean;
    votedProposalId: number | null;
}) => {
    const [showVoteButtons, setShowVoteButtons] = useState(false);

    // Format time remaining
    const formatTimeRemaining = () => {
        if (proposal.status !== 'active') return null;

        const now = Math.floor(Date.now() / 1000);
        const timeLeft = proposal.endTime - now;

        if (timeLeft <= 0) return 'Ended';

        const days = Math.floor(timeLeft / 86400);
        const hours = Math.floor((timeLeft % 86400) / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);

        if (days > 0) return `${days}d ${hours}h left`;
        if (hours > 0) return `${hours}h ${minutes}m left`;
        return `${minutes}m left`;
    };

    // Get status badge color and text
    const getStatusBadge = () => {
        switch (proposal.status) {
            case 'active':
                return {
                    bg: 'bg-[#37E8FF]/20',
                    text: 'text-[#37E8FF]',
                    label: 'Active'
                };
            case 'ended':
                return {
                    bg: 'bg-yellow-500/20',
                    text: 'text-yellow-500',
                    label: 'Ended (Unexecuted)'
                };
            case 'executed':
                return proposal.passed
                    ? { bg: 'bg-green-500/20', text: 'text-green-500', label: 'Passed' }
                    : { bg: 'bg-red-500/20', text: 'text-red-500', label: 'Failed' };
            default:
                return {
                    bg: 'bg-white/20',
                    text: 'text-white',
                    label: 'Unknown'
                };
        }
    };

    const statusBadge = getStatusBadge();
    const timeRemaining = formatTimeRemaining();
    const isThisProposalVoting = isVoting && votedProposalId === proposal.id;
    const isThisProposalExecuting = isExecuting && votedProposalId === proposal.id;

    return (
        <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all transform hover:translate-y-[-2px] duration-300">
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div className={`px-2 py-1 rounded-full ${statusBadge.bg} ${statusBadge.text} text-xs`}>
                        {statusBadge.label}
                    </div>

                    {timeRemaining && (
                        <div className="text-xs text-white/70">{timeRemaining}</div>
                    )}
                </div>

                <h3 className="font-bold text-lg text-white mb-2">{proposal.description}</h3>

                <p className="text-white/70 text-sm mb-4">
                    This proposal aims to update the channel content direction with new material.
                    {proposal.contentUri && (
                        <a
                            href={proposal.contentUri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-[#37E8FF] hover:underline inline-flex items-center"
                        >
                            View content plan
                            <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    )}
                </p>

                {/* Voting progress bar */}
                <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/70">For: {proposal.forVotes}</span>
                        <span className="text-white/70">Against: {proposal.againstVotes}</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="flex h-full">
                            <div
                                className="h-full bg-green-500/70"
                                style={{ width: `${proposal.forPercentage}%` }}
                            ></div>
                            <div
                                className="h-full bg-red-500/70"
                                style={{ width: `${proposal.againstPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Voting buttons or execution button */}
                {proposal.status === 'active' && !proposal.hasVoted && (
                    showVoteButtons ? (
                        <div className="flex space-x-2 items-center">
                            <button
                                onClick={() => {
                                    onVote(proposal.id, true);
                                    setShowVoteButtons(false);
                                }}
                                disabled={isVoting}
                                className="flex-1 py-2 bg-green-500/20 text-green-500 rounded-lg font-medium text-sm hover:bg-green-500/30 transition-all disabled:opacity-50 flex justify-center items-center"
                            >
                                {isThisProposalVoting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Voting...
                                    </>
                                ) : (
                                    'Vote For'
                                )}
                            </button>

                            <button
                                onClick={() => {
                                    onVote(proposal.id, false);
                                    setShowVoteButtons(false);
                                }}
                                disabled={isVoting}
                                className="flex-1 py-2 bg-red-500/20 text-red-500 rounded-lg font-medium text-sm hover:bg-red-500/30 transition-all disabled:opacity-50 flex justify-center items-center"
                            >
                                {isThisProposalVoting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Voting...
                                    </>
                                ) : (
                                    'Vote Against'
                                )}
                            </button>

                            <button
                                onClick={() => setShowVoteButtons(false)}
                                disabled={isVoting}
                                className="py-2 px-2 bg-[#121218] border border-white/10 text-white rounded-lg hover:border-white/30 transition-all disabled:opacity-50"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowVoteButtons(true)}
                            className="w-full py-2 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-lg font-medium text-sm hover:shadow-glow transition-all"
                        >
                            Cast Your Vote
                        </button>
                    )
                )}

                {proposal.status === 'active' && proposal.hasVoted && (
                    <div className="text-center py-2 px-4 bg-[#121218] border border-white/10 rounded-lg text-sm">
                        You&apos;ve already voted on this proposal
                    </div>
                )}

                {proposal.status === 'ended' && !proposal.executed && (
                    <button
                        onClick={() => onExecute(proposal.id)}
                        disabled={isExecuting}
                        className="w-full py-2 bg-[#37E8FF] text-[#121218] rounded-lg font-medium text-sm hover:shadow-glow transition-all disabled:opacity-50 flex justify-center items-center"
                    >
                        {isThisProposalExecuting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#121218]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Executing...
                            </>
                        ) : (
                            'Execute Proposal'
                        )}
                    </button>
                )}

                {proposal.status === 'executed' && (
                    <div className={`text-center py-2 px-4 rounded-lg text-sm ${proposal.passed
                        ? 'bg-green-500/20 border border-green-500/30 text-green-500'
                        : 'bg-red-500/20 border border-red-500/30 text-red-500'
                        }`}>
                        {proposal.passed ? 'Proposal passed' : 'Proposal failed'}
                    </div>
                )}
            </div>
        </div>
    );
};

// Create Proposal Modal Component
const CreateProposalModal = ({
    channelId,
    onClose,
    onCreateProposal,
    isCreating,
    minVotingPeriod
}: {
    channelId: number;
    onClose: () => void;
    onCreateProposal: (proposalData: { description: string; contentUri: string; votingPeriod: number }) => Promise<void>;
    isCreating: boolean;
    minVotingPeriod: number;
}) => {
    const [description, setDescription] = useState('');
    const [contentUri, setContentUri] = useState('');
    const [votingPeriod, setVotingPeriod] = useState(86400); // 24 hours in seconds (default)

    // Voting period options
    const votingPeriodOptions = [
        { label: '1 day', value: 86400 },
        { label: '3 days', value: 259200 },
        { label: '1 week', value: 604800 },
        { label: '2 weeks', value: 1209600 }
    ];

    // Check if form is valid
    const isValid = description.trim().length > 0 && contentUri.trim().length > 0 && votingPeriod >= minVotingPeriod;

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || isCreating) return;

        await onCreateProposal({
            description,
            contentUri,
            votingPeriod
        });
    };

    // Calculate min voting period in a readable format
    const formatMinVotingPeriod = () => {
        const hours = Math.floor(minVotingPeriod / 3600);
        if (hours < 24) return `${hours} hours`;

        const days = Math.floor(hours / 24);
        return `${days} day${days !== 1 ? 's' : ''}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative bg-[#1A1A24] rounded-2xl border border-white/10 shadow-xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
                >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <h2 className="text-xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                    Create New Proposal
                </h2>

                <p className="text-white/70 text-center mb-6">
                    For Channel #{channelId}
                </p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-white/70 text-sm mb-1">Proposal Title</label>
                        <input
                            type="text"
                            placeholder="Enter proposal title"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 bg-[#121218] rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm mb-1">Content URI (IPFS or other content link)</label>
                        <input
                            type="text"
                            placeholder="ipfs://... or https://..."
                            value={contentUri}
                            onChange={(e) => setContentUri(e.target.value)}
                            className="w-full px-4 py-2 bg-[#121218] rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white"
                            required
                        />
                        <p className="text-white/50 text-xs mt-1">
                            This should point to a document describing the proposed content direction.
                        </p>
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm mb-1">Voting Period</label>
                        <select
                            value={votingPeriod}
                            onChange={(e) => setVotingPeriod(parseInt(e.target.value))}
                            className="w-full px-4 py-2 bg-[#121218] rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white appearance-none"
                            required
                        >
                            {votingPeriodOptions.map(option => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                    disabled={option.value < minVotingPeriod}
                                >
                                    {option.label} {option.value < minVotingPeriod ? `(min: ${formatMinVotingPeriod()})` : ''}
                                </option>
                            ))}
                        </select>
                        <p className="text-white/50 text-xs mt-1">
                            Minimum voting period is {formatMinVotingPeriod()}.
                        </p>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={!isValid || isCreating}
                            className="w-full py-3 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-lg font-medium hover:shadow-glow transition-all disabled:opacity-50 flex justify-center items-center"
                        >
                            {isCreating ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Proposal...
                                </>
                            ) : (
                                'Create Proposal'
                            )}
                        </button>
                    </div>

                    <div className="bg-[#121218] rounded-lg p-4 border border-white/10">
                        <h4 className="font-medium text-white mb-2">What makes a good proposal?</h4>
                        <ul className="text-white/70 text-sm space-y-2">
                            <li className="flex items-start">
                                <svg className="w-4 h-4 text-[#37E8FF] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Clear description of the proposed content direction</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-4 h-4 text-[#37E8FF] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Link to comprehensive content plan with examples</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-4 h-4 text-[#37E8FF] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Explanation of how the proposal benefits the channel</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-4 h-4 text-[#37E8FF] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Specific guidance for the AI content generator</span>
                            </li>
                            <li className="flex items-start">
                                <svg className="w-4 h-4 text-[#37E8FF] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Reasonable voting period to allow all stakeholders to participate</span>
                            </li>
                        </ul>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Governance Page Component
export default function GovernancePage() {
    const { isConnected, connect, account, chainId } = useWallet();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contract: channelNFT, loading: loadingNFT } = useChannelNFT();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contract: governance, loading: loadingGovernance } = useGovernance();

    const searchParams = useSearchParams();
    const channelParam = searchParams.get('channel');

    const [selectedChannelId, setSelectedChannelId] = useState<number | undefined>(
        channelParam ? parseInt(channelParam) : undefined
    );

    const [channels, setChannels] = useState<Channel[]>([]);
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creatingProposal, setCreatingProposal] = useState(false);
    const [minVotingPeriod, setMinVotingPeriod] = useState(3600); // Default 1 hour
    const [votingState, setVotingState] = useState({
        isVoting: false,
        proposalId: null as number | null
    });
    const [executingState, setExecutingState] = useState({
        isExecuting: false,
        proposalId: null as number | null
    });
    const [refreshCounter, setRefreshCounter] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Fetch user's channels with voting power
    useEffect(() => {
        const fetchUserChannels = async () => {
            if (!channelNFT || !account) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // Get total number of channels
                const totalChannelsData = await channelNFT.getTotalChannels();
                const totalChannels = Number(totalChannelsData.toString());

                if (totalChannels === 0) {
                    setChannels([]);
                    setLoading(false);
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

                            // Calculate voting power
                            const totalShares = Number(channelData.totalShares.toString());
                            const votingPower = (Number(userShares.toString()) / totalShares) * 100;

                            const channel: Channel = {
                                id: i,
                                name: channelData.name,
                                description: channelData.description,
                                category: channelData.category,
                                creator: channelData.creator,
                                totalShares,
                                userShares: Number(userShares.toString()),
                                userSharePercentage: (Number(userShares.toString()) / totalShares) * 100,
                                votingPower
                            };

                            fetchedChannels.push(channel);
                        }
                    } catch (error) {
                        console.error(`Error processing channel ${i}:`, error);
                    }
                }

                setChannels(fetchedChannels);

                // If we have a selectedChannelId and it's not in the fetched channels, reset it
                if (selectedChannelId && !fetchedChannels.some(c => c.id === selectedChannelId)) {
                    setSelectedChannelId(undefined);
                }

            } catch (error) {
                console.error("Error fetching user channels:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserChannels();
    }, [channelNFT, account, refreshCounter]);

    // Fetch proposals for selected channel
    useEffect(() => {
        const fetchProposals = async () => {
            if (!governance || !selectedChannelId) {
                setProposals([]);
                return;
            }

            try {
                setLoading(true);

                // Get min voting period (for proposal creation)
                try {
                    const periodData = await governance.minVotingPeriod();
                    setMinVotingPeriod(Number(periodData.toString()));
                } catch (error) {
                    console.error("Error fetching min voting period:", error);
                }

                // Get proposals for this channel
                const proposalIds = await governance.getChannelProposals(selectedChannelId);

                if (proposalIds.length === 0) {
                    setProposals([]);
                    setLoading(false);
                    return;
                }

                const fetchedProposals: Proposal[] = [];
                const currentTime = Math.floor(Date.now() / 1000);

                for (const idBN of proposalIds) {
                    try {
                        const id = Number(idBN.toString());
                        const details = await governance.getProposalDetails(id);

                        // Determine proposal status
                        let status: 'active' | 'ended' | 'executed';
                        if (details.executed) {
                            status = 'executed';
                        } else if (currentTime > Number(details.endTime.toString())) {
                            status = 'ended';
                        } else {
                            status = 'active';
                        }

                        // Calculate voting percentages
                        const totalVotes = Number(details.forVotes.toString()) + Number(details.againstVotes.toString());
                        const forPercentage = totalVotes > 0 ? (Number(details.forVotes.toString()) / totalVotes) * 100 : 0;
                        const againstPercentage = totalVotes > 0 ? (Number(details.againstVotes.toString()) / totalVotes) * 100 : 0;

                        // Check if the current user has voted
                        let hasVoted = false;
                        if (account) {
                            try {
                                hasVoted = await governance.hasVoted(id, account);
                            } catch (error) {
                                console.error(`Error checking if user voted on proposal ${id}:`, error);
                            }
                        }

                        const proposal: Proposal = {
                            id,
                            channelId: Number(details.channelId.toString()),
                            description: details.description,
                            contentUri: details.contentUri,
                            startTime: Number(details.startTime.toString()),
                            endTime: Number(details.endTime.toString()),
                            proposer: details.proposer,
                            forVotes: Number(details.forVotes.toString()),
                            againstVotes: Number(details.againstVotes.toString()),
                            executed: details.executed,
                            passed: details.passed,
                            hasVoted,
                            status,
                            forPercentage,
                            againstPercentage
                        };

                        fetchedProposals.push(proposal);
                    } catch (error) {
                        console.error(`Error fetching proposal ${idBN.toString()}:`, error);
                    }
                }

                // Sort proposals: active first, then ended unexecuted, then executed, and within each category by most recent first
                fetchedProposals.sort((a, b) => {
                    // Sort by status
                    if (a.status !== b.status) {
                        if (a.status === 'active') return -1;
                        if (b.status === 'active') return 1;
                        if (a.status === 'ended') return -1;
                        if (b.status === 'ended') return 1;
                    }

                    // Within same status, sort by end time (most recent first)
                    return b.endTime - a.endTime;
                });

                setProposals(fetchedProposals);

            } catch (error) {
                console.error("Error fetching proposals:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProposals();
    }, [governance, selectedChannelId, account, refreshCounter]);

    // Handle channel selection
    const handleChannelSelect = (channelId: number) => {
        setSelectedChannelId(channelId);
        // Clear any error/success messages
        setError(null);
        setSuccess(null);
    };

    // Handle proposal creation
    const handleCreateProposal = async (proposalData: { description: string; contentUri: string; votingPeriod: number }) => {
        if (!governance || !isConnected || !selectedChannelId) return;

        try {
            setCreatingProposal(true);
            setError(null);

            // Create the proposal
            const tx = await governance.createProposal(
                selectedChannelId,
                proposalData.description,
                proposalData.contentUri,
                proposalData.votingPeriod
            );

            await tx.wait();

            // Close modal and refresh proposals
            setShowCreateModal(false);
            setRefreshCounter(prev => prev + 1);
            setSuccess('Proposal created successfully! Stakeholders can now vote on it.');

        } catch (error: any) {
            console.error("Error creating proposal:", error);

            // Extract meaningful error message if possible
            let errorMsg = "Failed to create proposal. Please try again.";
            if (error.message) {
                if (error.message.includes("below proposal threshold")) {
                    errorMsg = "You don't have enough voting power to create a proposal. The minimum threshold is 5% of total shares.";
                } else if (error.message.includes("voting period too short")) {
                    errorMsg = "The voting period is too short. Minimum period is " + (minVotingPeriod / 3600) + " hours.";
                }
            }

            setError(errorMsg);
        } finally {
            setCreatingProposal(false);
        }
    };

    // Handle voting on a proposal
    const handleVoteOnProposal = async (proposalId: number, support: boolean) => {
        if (!governance || !isConnected) return;

        try {
            setVotingState({
                isVoting: true,
                proposalId
            });
            setError(null);

            // Cast vote
            const tx = await governance.castVote(proposalId, support);
            await tx.wait();

            // Refresh proposals
            setRefreshCounter(prev => prev + 1);
            setSuccess(`Vote cast successfully! You voted ${support ? 'for' : 'against'} the proposal.`);

        } catch (error: any) {
            console.error("Error voting on proposal:", error);

            // Extract meaningful error message if possible
            let errorMsg = "Failed to cast vote. Please try again.";
            if (error.message && error.message.includes("voting ended")) {
                errorMsg = "Voting period has ended for this proposal.";
            } else if (error.message && error.message.includes("already voted")) {
                errorMsg = "You have already voted on this proposal.";
            }

            setError(errorMsg);
        } finally {
            setVotingState({
                isVoting: false,
                proposalId: null
            });
        }
    };

    // Handle executing a proposal
    const handleExecuteProposal = async (proposalId: number) => {
        if (!governance || !isConnected) return;

        try {
            setExecutingState({
                isExecuting: true,
                proposalId
            });
            setError(null);

            // Execute proposal
            const tx = await governance.executeProposal(proposalId);
            await tx.wait();

            // Refresh proposals
            setRefreshCounter(prev => prev + 1);
            setSuccess('Proposal executed successfully!');

        } catch (error: any) {
            console.error("Error executing proposal:", error);

            // Extract meaningful error message if possible
            let errorMsg = "Failed to execute proposal. Please try again.";
            if (error.message && error.message.includes("voting not ended")) {
                errorMsg = "Voting period has not ended yet for this proposal.";
            } else if (error.message && error.message.includes("already executed")) {
                errorMsg = "This proposal has already been executed.";
            }

            setError(errorMsg);
        } finally {
            setExecutingState({
                isExecuting: false,
                proposalId: null
            });
        }
    };

    // Count proposal stats
    const proposalStats = {
        total: proposals.length,
        active: proposals.filter(p => p.status === 'active').length,
        passed: proposals.filter(p => p.status === 'executed' && p.passed).length,
        failed: proposals.filter(p => p.status === 'executed' && !p.passed).length
    };

    return (
        <div className="min-h-screen bg-[#121218] text-white relative">
            <BackgroundAnimation />
            <AppNavBar />

            {/* Network Switcher */}
            {isConnected && <NetworkSwitcher currentChainId={chainId} />}

            <main className="max-w-screen-xl mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="relative z-10 mb-10">
                    <div className="flex flex-col md:flex-row gap-2 mb-4">
                        <div className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-[#1A1A24]/80 backdrop-blur-sm border border-[#37E8FF]/20">
                            <div className="w-2 h-2 rounded-full bg-[#37E8FF] mr-2 animate-pulse"></div>
                            <span className="text-white/80">Channel Governance</span>
                        </div>

                        <div className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-[#FFB800]/20 backdrop-blur-sm border border-[#FFB800]/30">
                            <span className="text-[#FFB800] font-medium">TESTNET MODE</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-3">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                                    Channel Governance
                                </span>
                            </h1>

                            <p className="text-white/70 text-lg max-w-2xl">
                                Shape the future of content through democratic decision making. Create and vote on proposals to direct channel content.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Error/Success Message */}
                {error && (
                    <div className="mb-6 p-4 bg-[#FF3D8A]/10 border border-[#FF3D8A]/30 rounded-lg text-[#FF3D8A] flex items-start">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500 flex items-start">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{success}</span>
                    </div>
                )}

                {/* Governance introduction for non-connected users */}
                {!isConnected && (
                    <div className="mb-10 bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#A742FF]">
                                Decentralized Content Governance Explained
                            </h2>

                            <div className="mb-8">
                                <p className="text-white/80 mb-4">
                                    KnowScroll&apos;s governance system allows channel stakeholders to collectively decide on content direction.
                                    As a token holder, your voting power is proportional to your share ownership.
                                </p>

                                <p className="text-white/80 mb-6">
                                    <span className="text-[#37E8FF] font-medium">Approved proposals directly guide our AI agents</span> to automatically
                                    generate educational videos and content. After a proposal passes, the AI will create draft content based on
                                    the approved direction, which stakeholders can review before public release.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                    <div className="bg-[#121218]/80 rounded-xl p-5 border border-white/10 flex flex-col">
                                        <div className="mb-4 flex justify-center">
                                            <div className="w-12 h-12 rounded-lg bg-[#37E8FF]/10 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-medium mb-2 text-center">Propose</h3>
                                        <p className="text-white/70 text-sm text-center">
                                            Any member with at least 5% ownership can create a proposal with a content direction plan.
                                        </p>
                                    </div>

                                    <div className="bg-[#121218]/80 rounded-xl p-5 border border-white/10 flex flex-col">
                                        <div className="mb-4 flex justify-center">
                                            <div className="w-12 h-12 rounded-lg bg-[#FF3D8A]/10 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-[#FF3D8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-medium mb-2 text-center">Vote</h3>
                                        <p className="text-white/70 text-sm text-center">
                                            Shareholders vote for or against proposals during the voting period.
                                        </p>
                                    </div>

                                    <div className="bg-[#121218]/80 rounded-xl p-5 border border-white/10 flex flex-col">
                                        <div className="mb-4 flex justify-center">
                                            <div className="w-12 h-12 rounded-lg bg-[#A742FF]/10 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-[#A742FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-medium mb-2 text-center">Execute</h3>
                                        <p className="text-white/70 text-sm text-center">
                                            After voting ends, passed proposals automatically direct the AI to create new content.
                                        </p>
                                    </div>

                                    <div className="bg-[#121218]/80 rounded-xl p-5 border border-white/10 flex flex-col md:col-span-3">
                                        <div className="mb-4 flex justify-center">
                                            <div className="w-12 h-12 rounded-lg bg-[#FF9800]/10 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-[#FF9800]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-medium mb-2 text-center">AI Content Creation</h3>
                                        <p className="text-white/70 text-sm text-center">
                                            Our AI automatically generates educational videos based on approved proposals. Stakeholders review draft content before it&apos;s published to the channel.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    onClick={connect}
                                    className="px-6 py-3 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-full font-medium hover:shadow-glow transition-all"
                                >
                                    Connect Wallet to Participate
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Grid Layout */}
                {isConnected && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <div>
                            <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
                                <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#A742FF]">
                                    Your Channels
                                </h2>

                                <p className="text-white/70 text-sm mb-4">
                                    Select a channel to view and create proposals.
                                </p>

                                <div className="mb-6">
                                    <ChannelSelector
                                        channels={channels}
                                        selectedChannelId={selectedChannelId}
                                        onSelect={handleChannelSelect}
                                        loading={loading}
                                    />
                                </div>

                                {selectedChannelId && (
                                    <div className="mt-6">
                                        <button
                                            onClick={() => setShowCreateModal(true)}
                                            className="w-full py-3 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-lg font-medium hover:shadow-glow transition-all flex items-center justify-center"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Create New Proposal
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Governance Info */}
                            <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FF3D8A] to-[#A742FF]">
                                    Governance Stats
                                </h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/70">Total Proposals</span>
                                        <span className="font-medium">{proposalStats.total}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/70">Active Voting</span>
                                        <span className="font-medium">{proposalStats.active}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/70">Passed Proposals</span>
                                        <span className="font-medium">{proposalStats.passed}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/70">Failed Proposals</span>
                                        <span className="font-medium">{proposalStats.failed}</span>
                                    </div>
                                </div>

                                <div className="bg-[#121218] p-4 rounded-lg border border-white/10">
                                    <h4 className="font-medium mb-2">How It Works</h4>
                                    <ul className="text-white/70 text-sm space-y-2">
                                        <li className="flex items-start">
                                            <span className="text-[#37E8FF] mr-2">1.</span>
                                            <span>Propose content direction with a clear plan</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#37E8FF] mr-2">2.</span>
                                            <span>Shareholders vote with weight based on shares</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#37E8FF] mr-2">3.</span>
                                            <span>Majority vote determines content strategy</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#37E8FF] mr-2">4.</span>
                                            <span>AI generates draft videos based on approved proposals</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="text-[#37E8FF] mr-2">5.</span>
                                            <span>Stakeholders review drafts before public release</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {selectedChannelId ? (
                                <>
                                    <div className="bg-[#1A1A24]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                        <h2 className="text-xl font-bold mb-6 flex items-center">
                                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                                                Channel #{selectedChannelId} Proposals
                                            </span>
                                            <div className="ml-3 h-px flex-grow bg-gradient-to-r from-[#37E8FF]/50 to-transparent"></div>
                                        </h2>

                                        {loading ? (
                                            <div className="flex flex-col items-center justify-center py-12">
                                                <div className="w-12 h-12 border-t-2 border-b-2 border-[#37E8FF] rounded-full animate-spin mb-4"></div>
                                                <p className="text-white/70">Loading proposals...</p>
                                            </div>
                                        ) : proposals.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {proposals.map(proposal => (
                                                    <ProposalCard
                                                        key={proposal.id}
                                                        proposal={proposal}
                                                        onVote={handleVoteOnProposal}
                                                        onExecute={handleExecuteProposal}
                                                        isVoting={votingState.isVoting}
                                                        isExecuting={executingState.isExecuting}
                                                        votedProposalId={votingState.proposalId || executingState.proposalId}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-[#121218]/30 rounded-xl p-8 text-center border border-white/5">
                                                <div className="w-16 h-16 rounded-full bg-[#1A1A24] border border-white/10 flex items-center justify-center mx-auto mb-4">
                                                    <svg className="w-8 h-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-xl font-bold mb-2">No Proposals Yet</h3>
                                                <p className="text-white/70 mb-6 max-w-md mx-auto">
                                                    Be the first to propose a new content direction for this channel.
                                                </p>
                                                <button
                                                    onClick={() => setShowCreateModal(true)}
                                                    className="px-6 py-3 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-full font-medium hover:shadow-glow transition-all inline-flex items-center"
                                                >
                                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    Create First Proposal
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="bg-[#1A1A24]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                                    <div className="max-w-md mx-auto">
                                        <div className="w-20 h-20 rounded-full bg-[#121218] border border-white/10 flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-10 h-10 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                                            Select a Channel
                                        </h2>
                                        <p className="text-white/70 mb-6">
                                            Choose a channel from the sidebar to view and create governance proposals.
                                        </p>

                                        {channels.length === 0 && !loading && (
                                            <Link
                                                href="/channels"
                                                className="px-6 py-3 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-full font-medium hover:shadow-glow transition-all inline-flex items-center"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                Find Channels to Join
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Create Proposal Modal */}
            {showCreateModal && selectedChannelId && (
                <CreateProposalModal
                    channelId={selectedChannelId}
                    onClose={() => setShowCreateModal(false)}
                    onCreateProposal={handleCreateProposal}
                    isCreating={creatingProposal}
                    minVotingPeriod={minVotingPeriod}
                />
            )}
        </div>
    );
}