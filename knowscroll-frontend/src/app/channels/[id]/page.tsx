/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import AppNavBar from '@/components/layout/AppNavBar';
import { useWallet } from '@/context/WalletContext';
import { useChannelNFT, useRevenueDistribution } from '@/hooks/useContract';


// Dynamically import the video component with SSR disabled
const VideoPlayer = dynamic(() => import('@/components/content/VideoPlayer'), {
    ssr: false,
});

// Types
interface Episode {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    videoSrc: string;
    duration: number;
    views: number;
    date: string;
    likes: number;
}

interface Series {
    id: string;
    title: string;
    description: string;
    episodes: Episode[];
}

// Background animation component for consistent styling
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

// Episode Card Component
const EpisodeCard = ({ episode, onPlay }: { episode: Episode, onPlay: (episode: Episode) => void }) => {
    // Format duration from seconds to MM:SS
    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Format view count
    const formatViews = (views: number): string => {
        if (views >= 1000000) {
            return (views / 1000000).toFixed(1) + 'M';
        } else if (views >= 1000) {
            return (views / 1000).toFixed(1) + 'K';
        } else {
            return views.toString();
        }
    };

    return (
        <div className="group relative bg-[#1A1A24]/60 rounded-lg overflow-hidden border border-white/10 hover:border-[#37E8FF]/30 transition-all transform hover:scale-[1.02] cursor-pointer"
            onClick={() => onPlay(episode)}>
            <div className="relative aspect-video">
                <Image
                    src={episode.thumbnail}
                    alt={episode.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform group-hover:scale-105"
                />

                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#37E8FF]/30 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 text-white text-xs font-medium">
                    {formatDuration(episode.duration)}
                </div>
            </div>

            <div className="p-3">
                <h3 className="font-medium text-white line-clamp-1">{episode.title}</h3>
                <div className="flex items-center justify-between mt-1 text-xs text-white/60">
                    <span>{formatViews(episode.views)} views</span>
                    <span>{episode.date}</span>
                </div>
            </div>
        </div>
    );
};

// Video player modal component
const VideoModal = ({ episode, onClose }: { episode: Episode, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/80" onClick={onClose}></div>

            <div className="relative w-full max-w-4xl bg-[#121218] rounded-xl overflow-hidden">
                <button
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60"
                    onClick={onClose}
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="aspect-video">
                    <VideoPlayer
                        src={episode.videoSrc}
                        isPlaying={true}
                        autoplay={true}
                        controls={true}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="p-5">
                    <h2 className="text-xl font-bold text-white">{episode.title}</h2>
                    <div className="flex items-center justify-between mt-2">
                        <div className="text-sm text-white/70">
                            {episode.views.toLocaleString()} views • {episode.date}
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="flex items-center text-white/80 hover:text-white">
                                <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>{episode.likes}</span>
                            </button>
                            <button className="flex items-center text-white/80 hover:text-white">
                                <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                <span>Share</span>
                            </button>
                            <button className="flex items-center text-white/80 hover:text-white">
                                <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                <span>Save</span>
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 text-white/80 text-sm">
                        {episode.description}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Channel Page Component
export default function ChannelPage({ params }: { params: { id: string } }) {
    // Unwrap params using React.use() to future-proof the code
    const unwrappedParams = use(params);
    const channelId = parseInt(unwrappedParams.id);
    const { isConnected, account } = useWallet();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contract: channelNFT, loading: loadingNFT } = useChannelNFT();
    const { contract: revenueDistribution } = useRevenueDistribution();

    const [channelData, setChannelData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [seriesData, setSeriesData] = useState<Series[]>([]);
    const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
    const [ownershipInfo, setOwnershipInfo] = useState({
        userShares: 0,
        userPercentage: 0,
        claimableRevenue: 0
    });
    const [isFollowing, setIsFollowing] = useState(false);

    // Fetch channel data from blockchain
    useEffect(() => {
        const fetchChannelData = async () => {
            if (!channelNFT) return;

            try {
                setLoading(true);

                // Get channel details from contract
                const channelData = await channelNFT.getChannel(channelId);

                // Format channel data
                const formattedChannel = {
                    id: channelId,
                    name: channelData.name,
                    description: channelData.description,
                    category: channelData.category,
                    creator: channelData.creator,
                    totalShares: Number(channelData.totalShares.toString()),
                    createdAt: Number(channelData.createdAt.toString()),
                    active: channelData.active
                };

                setChannelData(formattedChannel);

                // If user is connected, get ownership info
                if (isConnected && account) {
                    const userShares = await channelNFT.balanceOf(account, channelId);
                    const userSharesNum = Number(userShares.toString());

                    let claimableRevenue = 0;
                    if (revenueDistribution && userSharesNum > 0) {
                        const revenue = await revenueDistribution.getClaimableRevenue(channelId, account);
                        claimableRevenue = Number(revenue) / 1e18; // Convert from wei to ETH
                    }

                    setOwnershipInfo({
                        userShares: userSharesNum,
                        userPercentage: (userSharesNum / formattedChannel.totalShares) * 100,
                        claimableRevenue
                    });
                }

                // Generate dummy series data based on channel info
                generateDummyContent(formattedChannel);

            } catch (error) {
                console.error("Error fetching channel data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChannelData();
    }, [channelNFT, revenueDistribution, channelId, isConnected, account]);

    // Generate dummy content for display purposes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const generateDummyContent = (channel: any) => {
        // Generate series titles based on channel category
        let seriesTitles: string[] = [];
        let topics: string[] = [];

        switch (channel.category) {
            case 'Science':
                seriesTitles = ['Fundamentals', 'Advanced Concepts', 'Recent Discoveries'];
                topics = ['Physics', 'Biology', 'Chemistry', 'Astronomy'];
                break;
            case 'History':
                seriesTitles = ['Ancient Civilizations', 'Modern Era', 'Cultural Evolution'];
                topics = ['Wars', 'Inventions', 'Leaders', 'Revolutions'];
                break;
            case 'Technology':
                seriesTitles = ['Programming Basics', 'Advanced Development', 'Future Tech'];
                topics = ['AI', 'Blockchain', 'Web Development', 'Mobile Apps'];
                break;
            case 'Finance':
                seriesTitles = ['Investing Fundamentals', 'Advanced Strategies', 'Market Analysis'];
                topics = ['Stocks', 'Crypto', 'Real Estate', 'Retirement'];
                break;
            case 'Art':
                seriesTitles = ['Techniques', 'Art History', 'Contemporary Art'];
                topics = ['Painting', 'Sculpture', 'Digital Art', 'Photography'];
                break;
            case 'Education':
                seriesTitles = ['Learning Methods', 'Teaching Techniques', 'Educational Psychology'];
                topics = ['Memory', 'Study Skills', 'Classroom Management', 'Assessment'];
                break;
            default:
                seriesTitles = ['Getting Started', 'Intermediate', 'Advanced'];
                topics = ['Basics', 'Theory', 'Practice', 'Applications'];
        }

        // Generate dummy videos for each series
        const seriesData: Series[] = seriesTitles.map((title, index) => {
            // Generate episodes for this series
            const episodes: Episode[] = Array.from({ length: 6 + Math.floor(Math.random() * 6) }, (_, i) => {
                const randomTopic = topics[Math.floor(Math.random() * topics.length)];
                const randomDays = Math.floor(Math.random() * 60);
                const randomViews = 1000 + Math.floor(Math.random() * 100000);
                const randomLikes = Math.floor(randomViews * (0.05 + Math.random() * 0.15));
                const randomDuration = 120 + Math.floor(Math.random() * 600); // 2-12 minutes

                return {
                    id: i + 1,
                    title: `${randomTopic}: ${title} Part ${i + 1}`,
                    description: `Learn about ${randomTopic} in this ${title.toLowerCase()} lesson. This video covers the essential concepts, practical applications, and modern perspectives on this fascinating topic.`,
                    thumbnail: "/images/demo.png",
                    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Dummy video source
                    duration: randomDuration,
                    views: randomViews,
                    date: `${randomDays} days ago`,
                    likes: randomLikes
                };
            });

            return {
                id: `series-${index}`,
                title: title,
                description: `A comprehensive series about ${title.toLowerCase()} in ${channel.category}`,
                episodes
            };
        });

        setSeriesData(seriesData);
    };

    // Handle follow/unfollow button
    const toggleFollow = () => {
        setIsFollowing(!isFollowing);
    };

    // Format creator address for display
    const formatAddress = (address: string) => {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    // Handle play episode action
    const handlePlayEpisode = (episode: Episode) => {
        setSelectedEpisode(episode);
    };

    // Render loading state
    if (loading || !channelData) {
        return (
            <div className="min-h-screen bg-[#121218] text-white">
                <BackgroundAnimation />
                <AppNavBar />
                <div className="flex justify-center items-center h-[80vh]">
                    <div className="w-16 h-16 border-t-2 border-b-2 border-[#37E8FF] rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121218] text-white">
            <BackgroundAnimation />
            <AppNavBar />

            <main className="max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6">
                {/* Channel Header */}
                <div className="relative mb-8">
                    {/* Channel Cover Image */}
                    <div className="h-40 md:h-60 w-full rounded-xl overflow-hidden relative mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#37E8FF]/20 to-[#FF3D8A]/20"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#121218] to-transparent"></div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end">
                        {/* Channel Icon */}
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] p-[2px] -mt-10 md:ml-6 md:-mt-16 z-10 flex-shrink-0">
                            <div className="w-full h-full rounded-full bg-[#1A1A24] flex items-center justify-center">
                                <span className="text-xl md:text-2xl font-bold">
                                    #{channelData.id}
                                </span>
                            </div>
                        </div>

                        <div className="md:ml-6 mt-4 md:mt-0 flex-grow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold">{channelData.name}</h1>
                                    <div className="flex items-center mt-1 text-white/70">
                                        <span className="px-2 py-0.5 rounded-full bg-[#37E8FF]/20 text-[#37E8FF] text-xs">
                                            {channelData.category}
                                        </span>
                                        <span className="mx-2 text-white/40">•</span>
                                        <span>{Math.floor(Math.random() * 10000)} followers</span>
                                        <span className="mx-2 text-white/40">•</span>
                                        <span>Created {new Date(channelData.createdAt * 1000).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex space-x-3 mt-3 md:mt-0">
                                    <button
                                        onClick={toggleFollow}
                                        className={`px-4 py-2 rounded-lg font-medium ${isFollowing
                                            ? 'bg-white/10 text-white hover:bg-white/20'
                                            : 'bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white hover:shadow-glow'
                                            } transition-all`}
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>

                                    {isConnected && (
                                        <Link
                                            href={`/marketplace?channel=${channelId}`}
                                            className="px-4 py-2 bg-[#1A1A24] border border-white/10 hover:border-[#37E8FF]/30 rounded-lg text-sm font-medium transition-all"
                                        >
                                            Buy Shares
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <p className="text-white/70 text-sm md:text-base max-w-3xl">
                                {channelData.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Channel Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8">
                    <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                        <div className="text-sm text-white/60 mb-1">Creator</div>
                        <div className="font-medium flex items-center">
                            <a
                                href={`https://testnet.sonicscan.org/address/${channelData.creator}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#37E8FF] hover:underline"
                            >
                                {formatAddress(channelData.creator)}
                            </a>
                        </div>
                    </div>

                    <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                        <div className="text-sm text-white/60 mb-1">Total Episodes</div>
                        <div className="font-medium">
                            {seriesData.reduce((sum, series) => sum + series.episodes.length, 0)}
                        </div>
                    </div>

                    <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                        <div className="text-sm text-white/60 mb-1">Total Series</div>
                        <div className="font-medium">
                            {seriesData.length}
                        </div>
                    </div>

                    {isConnected ? (
                        <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                            <div className="text-sm text-white/60 mb-1">Your Ownership</div>
                            <div className="font-medium">
                                {ownershipInfo.userPercentage.toFixed(2)}%
                                {ownershipInfo.claimableRevenue > 0 && (
                                    <div className="text-xs text-[#37E8FF] mt-1">
                                        {ownershipInfo.claimableRevenue.toFixed(6)} S claimable
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                            <div className="text-sm text-white/60 mb-1">Total Shares</div>
                            <div className="font-medium">
                                {channelData.totalShares}
                            </div>
                        </div>
                    )}
                </div>

                {/* Featured Content */}
                {seriesData.length > 0 && seriesData[0].episodes.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                            Featured Content
                        </h2>

                        <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-xl overflow-hidden">
                            <Image
                                src={seriesData[0].episodes[0].thumbnail}
                                alt={seriesData[0].episodes[0].title}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 1024px"
                                className="object-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                <div className="text-sm text-[#37E8FF] mb-2">{seriesData[0].title}</div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-2">{seriesData[0].episodes[0].title}</h3>
                                <p className="text-white/70 text-sm md:text-base mb-4 max-w-2xl line-clamp-2 md:line-clamp-3">
                                    {seriesData[0].episodes[0].description}
                                </p>

                                <button
                                    onClick={() => handlePlayEpisode(seriesData[0].episodes[0])}
                                    className="px-6 py-3 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-lg font-medium hover:shadow-glow transition-all"
                                >
                                    Watch Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Series Content */}
                {seriesData.map(series => (
                    <div key={series.id} className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">{series.title}</h2>
                            <button className="text-sm text-white/70 hover:text-white">View All</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {series.episodes.slice(0, 4).map(episode => (
                                <EpisodeCard
                                    key={`${series.id}-${episode.id}`}
                                    episode={episode}
                                    onPlay={handlePlayEpisode}
                                />
                            ))}
                        </div>
                    </div>
                ))}

                {/* Ownership section - for logged in users */}
                {isConnected && (
                    <div className="mt-12 bg-[#1A1A24]/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                            Channel Ownership
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#121218]/60 rounded-lg p-4">
                                <div className="text-sm text-white/60 mb-1">Your Shares</div>
                                <div className="text-xl font-medium">{ownershipInfo.userShares}</div>
                                <div className="text-sm text-white/70 mt-1">
                                    ({ownershipInfo.userPercentage.toFixed(2)}% of total)
                                </div>
                            </div>

                            <div className="bg-[#121218]/60 rounded-lg p-4">
                                <div className="text-sm text-white/60 mb-1">Claimable Revenue</div>
                                <div className="text-xl font-medium">{ownershipInfo.claimableRevenue.toFixed(6)} S</div>
                                {ownershipInfo.claimableRevenue > 0 && (
                                    <button className="text-sm text-[#37E8FF] mt-1 hover:text-[#37E8FF]/80">
                                        Claim Now
                                    </button>
                                )}
                            </div>

                            <div className="bg-[#121218]/60 rounded-lg p-4 flex flex-col justify-between">
                                <div className="text-sm text-white/60 mb-1">Channel Actions</div>
                                <div className="flex flex-col space-y-2 mt-2">
                                    <Link
                                        href={`/marketplace?channel=${channelId}`}
                                        className="text-center px-4 py-2 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white rounded-lg text-sm font-medium hover:shadow-glow transition-all"
                                    >
                                        Trade Shares
                                    </Link>

                                    <Link
                                        href={`/governance?channel=${channelId}`}
                                        className="text-center px-4 py-2 bg-[#1A1A24] border border-white/10 text-white rounded-lg text-sm font-medium hover:border-[#37E8FF]/30 transition-all"
                                    >
                                        Governance
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Video Player Modal */}
            {selectedEpisode && (
                <VideoModal
                    episode={selectedEpisode}
                    onClose={() => setSelectedEpisode(null)}
                />
            )}
        </div>
    );
}