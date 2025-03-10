/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import AppNavBar from '@/components/layout/AppNavBar';
import { useWallet } from '@/context/WalletContext';
import { useChannelNFT } from '@/hooks/useContract';
import Link from 'next/link';
import { TESTNET_CHAIN_ID } from '@/lib/contracts/addresses';
import VideoFeedbackPanel from '@/components/content/VideoFeedbackPanel';
import VideoReviewTimeline from '@/components/content/VideoReviewTimeline';
import dynamic from 'next/dynamic';

// Dynamically import the video component with SSR disabled
const VideoPlayer = dynamic(() => import('@/components/content/VideoPlayer'), {
    ssr: false,
});

// Background animation component - reused from governance page
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

// Network Switcher Component - reused from governance page
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
// interface Channel {
//     id: number;
//     name: string;
//     description: string;
//     category: string;
//     creator: string;
//     totalShares: number;
//     userShares?: number;
//     userSharePercentage?: number;
//     votingPower?: number;
// }

interface VideoSegment {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl?: string;
    script?: string;
    duration: number;
    feedback?: string;
    approved?: boolean;
}

interface ContentDraft {
    id: string;
    title: string;
    channelId: number;
    proposalId: number;
    segments: VideoSegment[];
    createdAt: string;
    status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
    votingEndTime?: string;
    approvalVotes?: number;
    rejectionVotes?: number;
}

// Content Draft Card Component
const ContentDraftCard = ({
    draft,
    onClick,
    isSelected
}: {
    draft: ContentDraft;
    onClick: () => void;
    isSelected: boolean;
}) => {
    return (
        <div
            onClick={onClick}
            className={`bg-[#1A1A24] border rounded-lg overflow-hidden cursor-pointer transition-all transform hover:-translate-y-1 ${isSelected
                ? 'border-[#37E8FF] shadow-[0_0_15px_rgba(55,232,255,0.3)]'
                : 'border-white/10 hover:border-white/30'
                }`}
        >
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div className={`px-2 py-1 rounded-full text-xs ${draft.status === 'DRAFT'
                        ? 'bg-[#FFB800]/20 text-[#FFB800]'
                        : draft.status === 'UNDER_REVIEW'
                            ? 'bg-[#37E8FF]/20 text-[#37E8FF]'
                            : draft.status === 'APPROVED'
                                ? 'bg-green-500/20 text-green-500'
                                : 'bg-red-500/20 text-red-500'
                        }`}>
                        {draft.status.replace('_', ' ')}
                    </div>
                    <div className="text-xs text-white/50">Channel #{draft.channelId}</div>
                </div>

                <h3 className="font-bold text-md mb-2 truncate">{draft.title}</h3>

                <div className="text-xs text-white/70 mb-2">
                    {draft.segments.length} video segments • Created {new Date(draft.createdAt).toLocaleDateString()}
                </div>

                {draft.status === 'UNDER_REVIEW' && draft.votingEndTime && (
                    <div className="mt-2 text-xs text-white/70">
                        Voting ends: {new Date(draft.votingEndTime).toLocaleString()}
                    </div>
                )}

                {(draft.status === 'UNDER_REVIEW' && draft.approvalVotes !== undefined && draft.rejectionVotes !== undefined) && (
                    <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-green-500">Approve: {draft.approvalVotes}</span>
                            <span className="text-red-500">Reject: {draft.rejectionVotes}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="flex h-full">
                                <div
                                    className="h-full bg-green-500"
                                    style={{ width: `${draft.approvalVotes / (draft.approvalVotes + draft.rejectionVotes) * 100}%` }}
                                ></div>
                                <div
                                    className="h-full bg-red-500"
                                    style={{ width: `${draft.rejectionVotes / (draft.approvalVotes + draft.rejectionVotes) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Vote Modal Component
const VoteModal = ({
    draft,
    onClose,
    onVote,
    isVoting
}: {
    draft: ContentDraft;
    onClose: () => void;
    onVote: (approve: boolean, feedback: string) => Promise<void>;
    isVoting: boolean;
}) => {
    const [feedback, setFeedback] = useState('');

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
                    Vote on Content Draft
                </h2>

                <p className="text-white/70 text-center mb-6">
                    For Draft: {draft.title}
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-white/70 text-sm mb-1">Feedback (Optional)</label>
                        <textarea
                            placeholder="Provide feedback for the content creators..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="w-full px-4 py-2 bg-[#121218] rounded-lg border border-white/10 focus:border-[#37E8FF]/50 focus:outline-none text-white h-32"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <button
                            onClick={() => onVote(false, feedback)}
                            disabled={isVoting}
                            className="w-full py-3 bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg font-medium transition-all hover:bg-red-500/30 disabled:opacity-50 flex justify-center items-center"
                        >
                            {isVoting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Voting...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Reject Content
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => onVote(true, feedback)}
                            disabled={isVoting}
                            className="w-full py-3 bg-green-500/20 text-green-500 border border-green-500/30 rounded-lg font-medium transition-all hover:bg-green-500/30 disabled:opacity-50 flex justify-center items-center"
                        >
                            {isVoting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Voting...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Approve Content
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Content Review Page Component
export default function ContentReviewPage() {
    const { isConnected, connect, account, chainId } = useWallet();
    const { contract: channelNFT, loading: loadingNFT } = useChannelNFT();

    const [contentDrafts, setContentDrafts] = useState<ContentDraft[]>([]);
    const [selectedDraft, setSelectedDraft] = useState<ContentDraft | null>(null);
    const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [isVoting, setIsVoting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);


    useEffect(() => {
        const fetchContentDrafts = async () => {
            try {
                setLoading(true);

                // Simulate API call
                setTimeout(() => {
                    const mockDrafts: ContentDraft[] = [
                        {
                            id: 'draft_5fd517d5',
                            title: 'Blockchain Fundamentals',
                            channelId: 15,
                            proposalId: 42,
                            createdAt: '2023-03-08T12:30:00Z',
                            status: 'UNDER_REVIEW',
                            votingEndTime: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
                            approvalVotes: 65,
                            rejectionVotes: 35,
                            segments: [
                                {
                                    id: 'segment_1',
                                    title: 'What is Blockchain?',
                                    description: 'Introduction to blockchain technology',
                                    videoUrl: '/videos/blockchain_basics.mp4',
                                    thumbnailUrl: '/images/knowscroll3.png',
                                    script: "Blockchain is a distributed digital ledger that records transactions across multiple computers. Each block contains a timestamp and transaction data, and is linked to the previous block through cryptographic hashes.",
                                    duration: 120,
                                    feedback: '',
                                    approved: undefined
                                },
                                {
                                    id: 'segment_2',
                                    title: 'How Does Consensus Work?',
                                    description: 'Understanding consensus mechanisms',
                                    videoUrl: '/videos/consensus_mechanisms.mp4',
                                    thumbnailUrl: '/images/knowscroll3.png',
                                    script: "Consensus mechanisms ensure all participants agree on the ledger state. Popular methods include Proof of Work and Proof of Stake, where validators lock up tokens as collateral.",
                                    duration: 140,
                                    feedback: '',
                                    approved: undefined
                                },
                                {
                                    id: 'segment_3',
                                    title: 'Smart Contracts Explained',
                                    description: 'Introduction to smart contracts',
                                    videoUrl: '/videos/smart_contracts.mp4',
                                    thumbnailUrl: '/images/knowscroll3.png',
                                    script: "Smart contracts are self-executing programs that run on blockchain networks. They automatically enforce agreements between parties without needing intermediaries.",
                                    duration: 130,
                                    feedback: '',
                                    approved: undefined
                                }
                            ]
                        },
                        {
                            id: 'draft_7a9b3c4d',
                            title: 'Web3 Development Introduction',
                            channelId: 8,
                            proposalId: 36,
                            createdAt: '2023-03-06T10:15:00Z',
                            status: 'DRAFT',
                            segments: [
                                {
                                    id: 'segment_1',
                                    title: 'What is Web3?',
                                    description: 'Introduction to Web3 concepts',
                                    videoUrl: '/videos/web3_intro.mp4',
                                    thumbnailUrl: '/images/thumb_web3.jpg',
                                    script: "Web3 represents the next evolution of the internet, focused on decentralization and user ownership of data and digital assets.",
                                    duration: 150,
                                    feedback: '',
                                    approved: undefined
                                },
                                {
                                    id: 'segment_2',
                                    title: 'Building dApps',
                                    description: 'Introduction to decentralized applications',
                                    videoUrl: '/videos/dapps.mp4',
                                    thumbnailUrl: '/images/thumb_dapps.jpg',
                                    script: "Decentralized applications (dApps) run on a blockchain network instead of a single computer, making them resistant to censorship and central points of failure.",
                                    duration: 160,
                                    feedback: '',
                                    approved: undefined
                                }
                            ]
                        },
                        {
                            id: 'draft_8e2f1a7c',
                            title: 'Cryptocurrency Fundamentals',
                            channelId: 12,
                            proposalId: 29,
                            createdAt: '2023-03-04T14:45:00Z',
                            status: 'APPROVED',
                            approvalVotes: 82,
                            rejectionVotes: 18,
                            segments: [
                                {
                                    id: 'segment_1',
                                    title: 'What is Cryptocurrency?',
                                    description: 'Introduction to digital currencies',
                                    videoUrl: '/videos/crypto_intro.mp4',
                                    thumbnailUrl: '/images/thumb_crypto.jpg',
                                    script: "Cryptocurrencies are digital assets designed to work as a medium of exchange using cryptography to secure transactions.",
                                    duration: 130,
                                    feedback: 'Great explanation of the core concepts. Very clear for beginners.',
                                    approved: true
                                },
                                {
                                    id: 'segment_2',
                                    title: 'Crypto Wallets Explained',
                                    description: 'Understanding cryptocurrency wallets',
                                    videoUrl: '/videos/crypto_wallets.mp4',
                                    thumbnailUrl: '/images/thumb_wallets.jpg',
                                    script: "Cryptocurrency wallets are tools that store your private keys, allowing you to interact with various blockchains safely.",
                                    duration: 145,
                                    feedback: 'Very practical information. Maybe add more about hardware vs software wallets.',
                                    approved: true
                                }
                            ]
                        }
                    ];

                    setContentDrafts(mockDrafts);

                    // Set first draft as selected by default
                    if (mockDrafts.length > 0) {
                        setSelectedDraft(mockDrafts[0]);
                    }

                    setLoading(false);
                }, 1500);

            } catch (error) {
                console.error("Error fetching content drafts:", error);
                setLoading(false);
            }
        };

        fetchContentDrafts();
    }, []);

    // Handle draft selection
    const handleDraftSelect = (draft: ContentDraft) => {
        setSelectedDraft(draft);
        setSelectedSegmentIndex(0);
    };

    // Handle segment selection
    const handleSegmentSelect = (index: number) => {
        if (selectedDraft && index >= 0 && index < selectedDraft.segments.length) {
            setSelectedSegmentIndex(index);
        }
    };

    // Handle segment feedback
    const handleSegmentFeedback = (segmentId: string, feedback: string, approved: boolean | undefined) => {
        if (!selectedDraft) return;

        // Update the segment with feedback
        const updatedDraft = { ...selectedDraft };
        const segmentIndex = updatedDraft.segments.findIndex(seg => seg.id === segmentId);

        if (segmentIndex >= 0) {
            updatedDraft.segments[segmentIndex].feedback = feedback;
            updatedDraft.segments[segmentIndex].approved = approved;

            setSelectedDraft(updatedDraft);

            // Update the draft in the drafts array
            const draftsIndex = contentDrafts.findIndex(d => d.id === updatedDraft.id);
            if (draftsIndex >= 0) {
                const newDrafts = [...contentDrafts];
                newDrafts[draftsIndex] = updatedDraft;
                setContentDrafts(newDrafts);
            }

            setSuccess('Feedback saved successfully!');
            setTimeout(() => setSuccess(null), 3000);
        }
    };

    // Handle voting on a draft
    const handleVote = async (approve: boolean, feedback: string) => {
        if (!selectedDraft) return;

        try {
            setIsVoting(true);
            setError(null);

            // Simulate API call to blockchain
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Update draft status in local state
            const updatedDraft = { ...selectedDraft };
            // This is just for demo purposes - in a real implementation, you'd call your smart contract
            if (approve) {
                updatedDraft.approvalVotes = (updatedDraft.approvalVotes || 0) + 20;
            } else {
                updatedDraft.rejectionVotes = (updatedDraft.rejectionVotes || 0) + 20;
            }

            // Update the draft in the drafts array
            const draftsIndex = contentDrafts.findIndex(d => d.id === updatedDraft.id);
            if (draftsIndex >= 0) {
                const newDrafts = [...contentDrafts];
                newDrafts[draftsIndex] = updatedDraft;
                setContentDrafts(newDrafts);
                setSelectedDraft(updatedDraft);
            }

            // Close modal and show success message
            setShowVoteModal(false);
            setSuccess(`Vote cast successfully! You voted to ${approve ? 'approve' : 'reject'} the content.`);

        } catch (error: any) {
            console.error("Error voting on draft:", error);
            setError("Failed to cast vote. Please try again.");
        } finally {
            setIsVoting(false);
        }
    };

    // Handle initiating vote
    const handleInitiateVote = () => {
        if (selectedDraft && isConnected) {
            setShowVoteModal(true);
        } else if (!isConnected) {
            setError("Please connect your wallet to vote on content.");
        }
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
                            <span className="text-white/80">Content Review</span>
                        </div>

                        <div className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-[#FFB800]/20 backdrop-blur-sm border border-[#FFB800]/30">
                            <span className="text-[#FFB800] font-medium">TESTNET MODE</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-3">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                                    AI Content Review
                                </span>
                            </h1>

                            <p className="text-white/70 text-lg max-w-2xl">
                                Review and vote on AI-generated content before it's published to channels. Provide feedback to improve content quality.
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

                {!isConnected ? (
                    // Not connected view
                    <div className="mb-10 bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                        <div className="max-w-4xl mx-auto">
                            <div className="w-20 h-20 rounded-full bg-[#121218] border border-white/10 flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                                Content Review &amp; Voting
                            </h2>

                            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                                Connect your wallet to review and vote on AI-generated content drafts. Your feedback directly influences what gets published to channels.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-10">
                                <div className="bg-[#121218]/80 rounded-xl p-5 border border-white/10 flex flex-col">
                                    <div className="mb-4 flex justify-center">
                                        <div className="w-12 h-12 rounded-lg bg-[#37E8FF]/10 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-medium mb-2 text-center">Review</h3>
                                    <p className="text-white/70 text-sm text-center">
                                        Watch draft videos generated by AI based on approved governance proposals.
                                    </p>
                                </div>

                                <div className="bg-[#121218]/80 rounded-xl p-5 border border-white/10 flex flex-col">
                                    <div className="mb-4 flex justify-center">
                                        <div className="w-12 h-12 rounded-lg bg-[#FF3D8A]/10 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-[#FF3D8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-medium mb-2 text-center">Feedback</h3>
                                    <p className="text-white/70 text-sm text-center">
                                        Provide specific feedback on each video segment to improve content quality.
                                    </p>
                                </div>

                                <div className="bg-[#121218]/80 rounded-xl p-5 border border-white/10 flex flex-col">
                                    <div className="mb-4 flex justify-center">
                                        <div className="w-12 h-12 rounded-lg bg-[#A742FF]/10 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-[#A742FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-medium mb-2 text-center">Vote</h3>
                                    <p className="text-white/70 text-sm text-center">
                                        Cast your vote to approve or reject content drafts based on quality and relevance.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={connect}
                                className="px-6 py-3 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-full font-medium hover:shadow-glow transition-all"
                            >
                                Connect Wallet to Review Content
                            </button>
                        </div>
                    </div>
                ) : (
                    // Connected view - Main Content
                    <>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-16 h-16 border-t-2 border-b-2 border-[#37E8FF] rounded-full animate-spin mb-6"></div>
                                <p className="text-white/70 text-xl">Loading content drafts...</p>
                            </div>
                        ) : contentDrafts.length === 0 ? (
                            <div className="bg-[#1A1A24]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
                                <div className="w-20 h-20 rounded-full bg-[#121218] border border-white/10 flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>

                                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                                    No Content Drafts Available
                                </h2>

                                <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                                    There are currently no content drafts to review. Check back later or visit the governance page to propose new content directions.
                                </p>

                                <Link
                                    href="/governance"
                                    className="px-6 py-3 bg-[#1A1A24] border border-white/10 text-white rounded-full font-medium hover:border-white/30 transition-all inline-flex items-center"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Go to Governance
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Sidebar with Content Drafts */}
                                <div className="lg:col-span-4">
                                    <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                        <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#A742FF]">
                                            Content Drafts
                                        </h2>

                                        <p className="text-white/70 text-sm mb-4">
                                            Select a draft to review and provide feedback.
                                        </p>

                                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                            {contentDrafts.map(draft => (
                                                <ContentDraftCard
                                                    key={draft.id}
                                                    draft={draft}
                                                    onClick={() => handleDraftSelect(draft)}
                                                    isSelected={selectedDraft?.id === draft.id}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content Area */}
                                <div className="lg:col-span-8">
                                    {selectedDraft ? (
                                        <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                                            {/* Video Player Section */}
                                            <div className="relative">
                                                <div className="aspect-video bg-black">
                                                    <VideoPlayer
                                                        src={selectedDraft.segments[selectedSegmentIndex].videoUrl}
                                                        isPlaying={true}
                                                        playbackSpeed={1}
                                                        poster={selectedDraft.segments[selectedSegmentIndex].thumbnailUrl}
                                                        autoplay={true}
                                                    />
                                                </div>

                                                {/* Segment timeline */}
                                                <VideoReviewTimeline
                                                    segments={selectedDraft.segments}
                                                    currentIndex={selectedSegmentIndex}
                                                    onSelectSegment={handleSegmentSelect}
                                                />
                                            </div>

                                            {/* Video Info & Feedback Section */}
                                            <div className="p-6">
                                                <div className="mb-6">
                                                    <h3 className="text-2xl font-bold mb-2">
                                                        {selectedDraft.segments[selectedSegmentIndex].title}
                                                    </h3>
                                                    <p className="text-white/70">
                                                        {selectedDraft.segments[selectedSegmentIndex].description}
                                                    </p>
                                                </div>

                                                {/* Script */}
                                                <div className="mb-6">
                                                    <h4 className="text-sm text-white/70 mb-2">Script:</h4>
                                                    <div className="bg-[#121218] rounded-lg p-4 border border-white/10 text-white/90">
                                                        {selectedDraft.segments[selectedSegmentIndex].script}
                                                    </div>
                                                </div>

                                                {/* Feedback Panel */}
                                                <VideoFeedbackPanel
                                                    segment={selectedDraft.segments[selectedSegmentIndex]}
                                                    onSaveFeedback={handleSegmentFeedback}
                                                    readOnly={selectedDraft.status === 'APPROVED' || selectedDraft.status === 'REJECTED'}
                                                />

                                                {/* Draft level actions */}
                                                {selectedDraft.status === 'UNDER_REVIEW' && (
                                                    <div className="mt-8 flex justify-center">
                                                        <button
                                                            onClick={handleInitiateVote}
                                                            className="px-8 py-3 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-full font-medium hover:shadow-glow transition-all flex items-center"
                                                        >
                                                            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Vote on This Content Draft
                                                        </button>
                                                    </div>
                                                )}

                                                {selectedDraft.status === 'DRAFT' && (
                                                    <div className="mt-8 text-center">
                                                        <div className="inline-block px-4 py-2 rounded-full bg-[#FFB800]/20 text-[#FFB800] text-sm">
                                                            This content is in draft stage - awaiting review by stakeholders
                                                        </div>
                                                    </div>
                                                )}

                                                {selectedDraft.status === 'APPROVED' && (
                                                    <div className="mt-8 text-center">
                                                        <div className="inline-block px-4 py-2 rounded-full bg-green-500/20 text-green-500 text-sm">
                                                            This content has been approved and published to the channel
                                                        </div>
                                                    </div>
                                                )}

                                                {selectedDraft.status === 'REJECTED' && (
                                                    <div className="mt-8 text-center">
                                                        <div className="inline-block px-4 py-2 rounded-full bg-red-500/20 text-red-500 text-sm">
                                                            This content was rejected by stakeholders
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
                                            <div className="max-w-md mx-auto">
                                                <div className="w-20 h-20 rounded-full bg-[#121218] border border-white/10 flex items-center justify-center mx-auto mb-6">
                                                    <svg className="w-10 h-10 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </div>

                                                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                                                    Select a Content Draft
                                                </h2>

                                                <p className="text-white/70 mb-6">
                                                    Choose a content draft from the sidebar to review and provide feedback.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Vote Modal */}
            {showVoteModal && selectedDraft && (
                <VoteModal
                    draft={selectedDraft}
                    onClose={() => setShowVoteModal(false)}
                    onVote={handleVote}
                    isVoting={isVoting}
                />
            )}
        </div>
    );
}