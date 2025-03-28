"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import Link from 'next/link';
import Image from 'next/image';
import { SwipeDirection, SwipeType } from '@/hooks/useSwipe';
import dynamic from 'next/dynamic';
import IntegratedNavigationSystem from '@/components/content/IntegratedNavigationSystem';

// Dynamically import the video component with SSR disabled
const VideoPlayer = dynamic(() => import('@/components/content/VideoPlayer'), {
    ssr: false,
});

// Types for our content
type Series = {
    id: string;
    title: string;
    category: string;
    episodes: Episode[];
    currentEpisodeIndex: number;
};

type Episode = {
    id: number;
    title: string;
    description: string;
    progress: number; // 0-100
    imageSrc: string;
    videoSrc?: string; // Optional video source
    channelId: number;
    channelName: string;
    duration: number; // Duration in seconds
    likes: number;
    views: number;
};

export default function ExplorePage() {
    const { isConnected } = useWallet();
    const [activeIndex, setActiveIndex] = useState(1); // Center card is active
    const [seriesData, setSeriesData] = useState<Series[]>([]);
    const [isPlaying, setIsPlaying] = useState(true); // Auto-play by default
    const [currentProgress, setCurrentProgress] = useState(0);
    const [showFullContent, setShowFullContent] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [userLikes, setUserLikes] = useState<{ [key: string]: boolean }>({});
    const [userSaves, setUserSaves] = useState<{ [key: string]: boolean }>({});
    // const progressTimer = useRef<NodeJS.Timeout | null>(null);
    const [isMobileView, setIsMobileView] = useState(false);
    const [showInfo, setShowInfo] = useState(true);
    const [transitioning, setTransitioning] = useState(false);
    const [showTutorial, setShowTutorial] = useState(true);
    const [swipeDirection, setSwipeDirection] = useState<SwipeDirection>(null);
    const [swipeIndicatorVisible, setSwipeIndicatorVisible] = useState(false);

    // Richer sample data with more episodes for vertical scrolling
    useEffect(() => {
        const initialSeriesData: Series[] = [
            {
                id: "quantum-physics",
                title: "Quantum Physics",
                category: "Science",
                currentEpisodeIndex: 0,
                episodes: [
                    {
                        id: 1,
                        title: "Quantum Entanglement",
                        description: "Quantum entanglement is a physical phenomenon that occurs when a group of particles are generated, interact, or share spatial proximity in a way such that the quantum state of each particle cannot be described independently of the state of the others, including when the particles are separated by a large distance.",
                        progress: 0,
                        imageSrc: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=500",
                        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                        channelId: 1,
                        channelName: "Quantum Realm",
                        duration: 65,
                        likes: 2451,
                        views: 35840
                    },
                    {
                        id: 2,
                        title: "Wave-Particle Duality",
                        description: "Wave-particle duality is the concept in quantum mechanics that every particle or quantum entity may be described as either a particle or a wave. It expresses the inability of classical concepts like 'particle' or 'wave' to fully describe the behavior of quantum-scale objects.",
                        progress: 0,
                        imageSrc: "https://images.unsplash.com/photo-1610979290107-4aa84d3c39c5?q=80&w=500",
                        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                        channelId: 1,
                        channelName: "Quantum Realm",
                        duration: 55,
                        likes: 1983,
                        views: 28792
                    },
                    {
                        id: 3,
                        title: "Schrödinger's Cat",
                        description: "Schrödinger's cat is a thought experiment devised by Erwin Schrödinger in 1935, which illustrates what he saw as the problem of the Copenhagen interpretation of quantum mechanics. The scenario presents a cat that may be simultaneously both alive and dead, a state known as a quantum superposition.",
                        progress: 0,
                        imageSrc: "https://images.unsplash.com/photo-1608588722255-6330d432a376?q=80&w=500",
                        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                        channelId: 1,
                        channelName: "Quantum Realm",
                        duration: 60,
                        likes: 2341,
                        views: 31842
                    },
                    {
                        id: 4,
                        title: "Quantum Tunneling",
                        description: "Quantum tunneling is a quantum mechanical phenomenon where a particle tunnels through a barrier that it classically could not surmount. This plays an essential role in several physical phenomena, such as nuclear fusion in stars and the operation of certain semiconductor devices.",
                        progress: 0,
                        imageSrc: "https://images.unsplash.com/photo-1623932666557-048f7f754212?q=80&w=500",
                        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                        channelId: 1,
                        channelName: "Quantum Realm",
                        duration: 58,
                        likes: 1842,
                        views: 29751
                    }
                ]
            },
            {
                id: "worldwar2",
                title: "World War II",
                category: "History",
                currentEpisodeIndex: 0,
                episodes: [
                    {
                        id: 1,
                        title: "Origins of WWII",
                        description: "The origins of World War II can be traced back to the harsh Treaty of Versailles that ended World War I. This treaty imposed severe economic sanctions on Germany and required the country to accept responsibility for the war. The Great Depression further destabilized Europe, creating conditions that allowed the Nazi Party to rise to power.",
                        progress: 0,
                        imageSrc: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=500",
                        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
                        channelId: 2,
                        channelName: "History Channel",
                        duration: 75,
                        likes: 2456,
                        views: 52103
                    },
                    {
                        id: 2,
                        title: "The Pacific Theater",
                        description: "The Pacific War was the theater of World War II fought in the Pacific and East Asia. It began with Japan's attack on Pearl Harbor on December 7, 1941, and concluded with Japan's surrender to the Allies on September 2, 1945, which brought the war to an end.",
                        progress: 0,
                        imageSrc: "https://images.unsplash.com/photo-1604918898611-3e1ec2f3d77c?q=80&w=500",
                        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
                        channelId: 2,
                        channelName: "History Channel",
                        duration: 65,
                        likes: 1876,
                        views: 43290
                    },
                    {
                        id: 3,
                        title: "D-Day Invasion",
                        description: "The Normandy landings, codenamed Operation Neptune, were the landing operations of the Allied invasion of Normandy in Operation Overlord during World War II. The landings commenced on June 6, 1944 (D-Day), beginning the liberation of German-occupied France from Nazi control.",
                        progress: 0,
                        imageSrc: "https://images.unsplash.com/photo-1534375866924-7eacd63fcb11?q=80&w=500",
                        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
                        channelId: 2,
                        channelName: "History Channel",
                        duration: 70,
                        likes: 2854,
                        views: 57103
                    },
                    {
                        id: 4,
                        title: "The Fall of Berlin",
                        description: "The Battle of Berlin, designated the Berlin Strategic Offensive Operation by the Soviet Union, was the final major offensive of the European theatre of World War II. Following the Vistula–Oder Offensive of January–February 1945, the Red Army had temporarily halted on a line 60 km (37 mi) east of Berlin.",
                        progress: 0,
                        imageSrc: "https://images.unsplash.com/photo-1612531806146-485c500195f2?q=80&w=500",
                        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
                        channelId: 2,
                        channelName: "History Channel",
                        duration: 68,
                        likes: 2143,
                        views: 48750
                    }
                ]
            },
            {
                id: "space",
                title: "Space Exploration",
                category: "Science",
                currentEpisodeIndex: 0,
                episodes: [
                    {
                        id: 1,
                        title: "The Space Race",
                        description: "The Space Race was a competition between the United States and the Soviet Union starting in the 1950s. Both nations sought to demonstrate technological superiority through achievements in spaceflight, culminating in the historic Apollo moon landing in 1969.",
                        progress: 0,
                        imageSrc: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=500",
                        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
                        channelId: 3,
                        channelName: "Space Channel",
                        duration: 55,
                        likes: 3245,
                        views: 78465
                    },
                    {
                        id: 2,
                        title: "Mars: The Next Frontier",
                        description: "As humans look beyond Earth, Mars has emerged as our most promising destination for colonization. This episode explores the challenges of Mars missions, from the harsh environment to the technological hurdles of getting there and sustaining human life.",
                        progress: 0,
                        imageSrc: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=500",
                        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
                        channelId: 3,
                        channelName: "Space Channel",
                        duration: 60,
                        likes: 2198,
                        views: 58741
                    },
                    {
                        id: 3,
                        title: "Black Holes Explained",
                        description: "Black holes are regions of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it. This episode explores the formation, properties, and mysteries of these cosmic phenomena.",
                        progress: 0,
                        imageSrc: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=500",
                        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                        channelId: 3,
                        channelName: "Space Channel",
                        duration: 62,
                        likes: 2876,
                        views: 67432
                    },
                    {
                        id: 4,
                        title: "Exoplanets: Worlds Beyond",
                        description: "Exoplanets are planets beyond our solar system. Thousands have been discovered in the past two decades, many by NASA's Kepler Space Telescope. This episode explores these distant worlds and their potential to harbor life.",
                        progress: 0,
                        imageSrc: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=500",
                        videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                        channelId: 3,
                        channelName: "Space Channel",
                        duration: 58,
                        likes: 2435,
                        views: 63521
                    }
                ]
            }
        ];

        setSeriesData(initialSeriesData);
    }, []);

    // Format numbers for display (e.g., 1.2k instead of 1200)
    const formatNumber = (num: number): string => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        } else {
            return num.toString();
        }
    };

    // Get the active series and episode
    const activeSeries = seriesData[activeIndex];
    const activeEpisode = activeSeries?.episodes[activeSeries?.currentEpisodeIndex || 0];

    // Check for mobile viewport on component mount
    useEffect(() => {
        const checkMobile = () => {
            setIsMobileView(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

    // Preview content provider for the IntegratedNavigationSystem
    const getPreviewContent = (direction: SwipeDirection, type: SwipeType) => {
        if (!activeSeries || !activeEpisode) return null;

        if (type === 'series') {
            // For series navigation (up/down)
            if (direction === 'up' && activeSeries.currentEpisodeIndex < activeSeries.episodes.length - 1) {
                const nextEpisode = activeSeries.episodes[activeSeries.currentEpisodeIndex + 1];
                return {
                    title: nextEpisode.title,
                    image: nextEpisode.imageSrc,
                    description: nextEpisode.description,
                    category: activeSeries.category
                };
            } else if (direction === 'down' && activeSeries.currentEpisodeIndex > 0) {
                const prevEpisode = activeSeries.episodes[activeSeries.currentEpisodeIndex - 1];
                return {
                    title: prevEpisode.title,
                    image: prevEpisode.imageSrc,
                    description: prevEpisode.description,
                    category: activeSeries.category
                };
            }
        } else if (type === 'topic') {
            // For topic navigation (left/right)
            const targetIndex = direction === 'left'
                ? (activeIndex === seriesData.length - 1 ? 0 : activeIndex + 1)
                : (activeIndex === 0 ? seriesData.length - 1 : activeIndex - 1);

            if (!seriesData[targetIndex]) return null;

            const targetSeries = seriesData[targetIndex];
            const targetEpisode = targetSeries.episodes[targetSeries.currentEpisodeIndex];

            return {
                title: targetSeries.title,
                image: targetEpisode.imageSrc,
                description: targetEpisode.description,
                category: targetSeries.category
            };
        }

        return null;
    };

    // Swipe handler functions for IntegratedNavigationSystem
    const handleSwipeLeft = () => {
        if (transitioning) return;
        setTransitioning(true);
        setSwipeDirection('left');
        setSwipeIndicatorVisible(true);

        setTimeout(() => {
            navigateNext();
            setTransitioning(false);

            setTimeout(() => {
                setSwipeIndicatorVisible(false);
                setSwipeDirection(null);
            }, 500);
        }, 300);
    };

    const handleSwipeRight = () => {
        if (transitioning) return;
        setTransitioning(true);
        setSwipeDirection('right');
        setSwipeIndicatorVisible(true);

        setTimeout(() => {
            navigatePrev();
            setTransitioning(false);

            setTimeout(() => {
                setSwipeIndicatorVisible(false);
                setSwipeDirection(null);
            }, 500);
        }, 300);
    };

    const handleSwipeUp = () => {
        if (transitioning) return;
        setTransitioning(true);
        setSwipeDirection('up');
        setSwipeIndicatorVisible(true);

        if (activeSeries?.currentEpisodeIndex < (activeSeries?.episodes.length - 1)) {
            setTimeout(() => {
                const newSeriesData = [...seriesData];
                newSeriesData[activeIndex].currentEpisodeIndex += 1;
                setSeriesData(newSeriesData);
                setCurrentProgress(0);
                setTransitioning(false);

                setTimeout(() => {
                    setSwipeIndicatorVisible(false);
                    setSwipeDirection(null);
                }, 500);
            }, 300);
        } else {
            setTimeout(() => {
                setTransitioning(false);
                setSwipeIndicatorVisible(false);
                setSwipeDirection(null);
            }, 300);
        }
    };

    const handleSwipeDown = () => {
        if (transitioning) return;
        setTransitioning(true);
        setSwipeDirection('down');
        setSwipeIndicatorVisible(true);

        if (showFullContent) {
            setTimeout(() => {
                setShowFullContent(false);
                setTransitioning(false);

                setTimeout(() => {
                    setSwipeIndicatorVisible(false);
                    setSwipeDirection(null);
                }, 500);
            }, 300);
        } else if (activeSeries?.currentEpisodeIndex > 0) {
            setTimeout(() => {
                const newSeriesData = [...seriesData];
                newSeriesData[activeIndex].currentEpisodeIndex -= 1;
                setSeriesData(newSeriesData);
                setCurrentProgress(0);
                setTransitioning(false);

                setTimeout(() => {
                    setSwipeIndicatorVisible(false);
                    setSwipeDirection(null);
                }, 500);
            }, 300);
        } else {
            setTimeout(() => {
                setTransitioning(false);
                setSwipeIndicatorVisible(false);
                setSwipeDirection(null);
            }, 300);
        }
    };

    // Toggle play/pause
    const handlePlay = () => {
        setIsPlaying(!isPlaying);
    };

    // Navigate to next series
    const navigateNext = () => {
        setActiveIndex((prev) => (prev === seriesData.length - 1 ? 0 : prev + 1));
        setCurrentProgress(0);
    };

    // Navigate to previous series
    const navigatePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? seriesData.length - 1 : prev - 1));
        setCurrentProgress(0);
    };

    // Handle speed change
    const handleSpeedChange = () => {
        const speeds = [0.5, 1, 1.5, 2];
        const currentIndex = speeds.indexOf(playbackSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;

        setPlaybackSpeed(speeds[nextIndex]);
    };

    // Handle like action
    const handleLike = (seriesId: string, episodeId: number) => {
        const key = `${seriesId}-${episodeId}`;
        setUserLikes(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Handle save action
    const handleSave = (seriesId: string, episodeId: number) => {
        const key = `${seriesId}-${episodeId}`;
        setUserSaves(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Handle video progress updates
    const handleVideoProgress = (progress: number) => {
        setCurrentProgress(progress);
    };

    // Handle video end
    const handleVideoEnd = () => {
        // Automatically go to next episode or next series
        if (activeSeries && activeSeries.currentEpisodeIndex < activeSeries.episodes.length - 1) {
            const newSeriesData = [...seriesData];
            newSeriesData[activeIndex].currentEpisodeIndex += 1;
            setSeriesData(newSeriesData);
            setCurrentProgress(0);
        } else {
            navigateNext();
        }
    };

    // Toggle info overlay
    const toggleInfo = () => {
        setShowInfo(!showInfo);
    };

    // Determine card position classes based on active index
    const getCardPositionClass = (index: number) => {
        if (index === activeIndex) return 'z-20 scale-100 opacity-100 translate-x-0';

        if (index < activeIndex) {
            // Cards to the left
            return 'z-10 scale-90 opacity-60 -translate-x-12 rotate-[-5deg]';
        } else {
            // Cards to the right
            return 'z-10 scale-90 opacity-60 translate-x-12 rotate-[5deg]';
        }
    };

    // Render swipe indicators
    const renderSwipeIndicator = () => {
        if (!swipeIndicatorVisible || !swipeDirection) return null;

        const indicatorClasses = {
            up: "top-10 left-1/2 -translate-x-1/2 -translate-y-full",
            down: "bottom-10 left-1/2 -translate-x-1/2 translate-y-full",
            left: "left-10 top-1/2 -translate-x-full -translate-y-1/2",
            right: "right-10 top-1/2 translate-x-full -translate-y-1/2"
        };

        const icons = {
            up: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>,
            down: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>,
            left: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
            right: <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        };

        return (
            <div className={`absolute ${indicatorClasses[swipeDirection]} transition-all duration-300 ease-out transform`}>
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white animate-pulse">
                    {icons[swipeDirection]}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#121218] text-white overflow-hidden">
            {/* App header */}
            <div className="p-4 pt-6 bg-gradient-to-b from-[#121218] to-transparent fixed top-0 left-0 right-0 z-30">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold text-[#37E8FF]">
                        KnowScroll
                    </Link>

                    {isConnected ? (
                        <div className="bg-[#1A1A24]/70 px-3 py-1 rounded-full text-sm flex items-center">
                            <div className="w-2 h-2 rounded-full bg-[#37E8FF] mr-2"></div>
                            <span>Connected</span>
                        </div>
                    ) : (
                        <button className="bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] text-white px-3 py-1 rounded-full text-sm">
                            Connect
                        </button>
                    )}
                </div>
            </div>

            {/* Main content area with IntegratedNavigationSystem */}
            <IntegratedNavigationSystem
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onSwipeUp={handleSwipeUp}
                onSwipeDown={handleSwipeDown}
                getPreviewContent={getPreviewContent}
                showTutorial={showTutorial}
                onTutorialDismiss={() => setShowTutorial(false)}
            >
                <div className="relative min-h-screen w-full flex items-center justify-center pt-16 pb-20">
                    {/* Swipe indicator */}
                    {renderSwipeIndicator()}

                    {/* Cards container - for desktop */}
                    {!isMobileView && (
                        <div className="flex justify-center items-center w-full max-w-[1100px] h-[80vh] relative">
                            {seriesData.map((series, index) => {
                                if (!series) return null;
                                const episode = series.episodes[series.currentEpisodeIndex];
                                if (!episode) return null;

                                const isActive = index === activeIndex;
                                const likeKey = `${series.id}-${episode.id}`;
                                const isLiked = userLikes[likeKey] || false;

                                return (
                                    <div
                                        key={series.id}
                                        className={`content-card absolute w-[330px] h-[600px] rounded-xl overflow-hidden shadow-lg
                                            ${getCardPositionClass(index)}
                                            ${isActive ? 'border-2 border-[#37E8FF]/30' : 'cursor-pointer'}
                                            transition-all duration-300 ease-out`}
                                        onClick={() => !isActive && setActiveIndex(index)}
                                    >
                                        {/* Card image or video */}
                                        <div className="relative h-full w-full overflow-hidden">
                                            {/* Show image by default */}
                                            {!isActive || !isPlaying ? (
                                                <Image
                                                    src={episode.imageSrc}
                                                    alt={episode.title}
                                                    fill
                                                    priority={isActive}
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    style={{ objectFit: 'cover' }}
                                                    className={`brightness-75 transition-transform duration-300 ${transitioning && isActive ? 'scale-110' : 'scale-100'
                                                        }`}
                                                />
                                            ) : null}

                                            {/* Show video when playing and this is the active card */}
                                            {isActive && (
                                                <div className={`absolute inset-0 transition-transform duration-300 ${transitioning ? 'scale-110' : 'scale-100'
                                                    }`}>
                                                    <VideoPlayer
                                                        src={episode.videoSrc}
                                                        isPlaying={isPlaying}
                                                        playbackSpeed={playbackSpeed}
                                                        onTimeUpdate={handleVideoProgress}
                                                        onEnded={handleVideoEnd}
                                                        className="h-full w-full object-cover"
                                                        poster={episode.imageSrc}
                                                        autoplay={true}
                                                    />
                                                </div>
                                            )}

                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
                                        </div>

                                        {/* Reel controls overlay - only on active card */}
                                        {isActive && (
                                            <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6">
                                                {/* Like button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleLike(series.id, episode.id);
                                                    }}
                                                    className="flex flex-col items-center"
                                                >
                                                    <div className={`w-12 h-12 rounded-full ${isLiked ? 'bg-[#FF3D8A]/30' : 'bg-black/40'} backdrop-blur-sm flex items-center justify-center transform transition-transform active:scale-90`}>
                                                        <svg className={`w-6 h-6 ${isLiked ? 'text-[#FF3D8A]' : 'text-white'}`} fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-xs mt-1">{formatNumber(episode.likes + (isLiked ? 1 : 0))}</span>
                                                </button>

                                                {/* Comment button */}
                                                <button className="flex flex-col items-center">
                                                    <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transform transition-transform active:scale-90">
                                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-xs mt-1">Comment</span>
                                                </button>

                                                {/* Save button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSave(series.id, episode.id);
                                                    }}
                                                    className="flex flex-col items-center"
                                                >
                                                    <div className={`w-12 h-12 rounded-full ${userSaves[likeKey] ? 'bg-[#37E8FF]/30' : 'bg-black/40'} backdrop-blur-sm flex items-center justify-center transform transition-transform active:scale-90`}>
                                                        <svg className={`w-6 h-6 ${userSaves[likeKey] ? 'text-[#37E8FF]' : 'text-white'}`} fill={userSaves[likeKey] ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-xs mt-1">Save</span>
                                                </button>

                                                {/* Speed control */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSpeedChange();
                                                    }}
                                                    className="flex flex-col items-center"
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transform transition-transform active:scale-90">
                                                        <span className="text-white font-medium">{playbackSpeed}x</span>
                                                    </div>
                                                    <span className="text-xs mt-1">Speed</span>
                                                </button>
                                            </div>
                                        )}

                                        {/* Card content */}
                                        {(showInfo || !isActive || !isPlaying) && (
                                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                                <div className="mb-2 flex justify-between items-end">
                                                    <div>
                                                        <div className="text-xs text-[#37E8FF] mb-1 uppercase tracking-wide">
                                                            {series.category}
                                                        </div>
                                                        <h3 className="font-bold text-xl text-white leading-tight">
                                                            {series.title}
                                                        </h3>
                                                        <p className="text-sm mt-1">{episode.title}</p>
                                                    </div>
                                                    <div className={`text-sm px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm transition-colors ${series.episodes.length > 1 ? 'bg-[#37E8FF]/20 text-[#37E8FF]' : ''}`}>
                                                        EP {series.currentEpisodeIndex + 1}/{series.episodes.length}
                                                    </div>
                                                </div>

                                                {/* Description - only show on active card */}
                                                {isActive && (
                                                    <p className="text-sm text-white/80 mt-2 line-clamp-2">
                                                        {episode.description}
                                                    </p>
                                                )}

                                                {/* Progress bar */}
                                                <div className="mt-4 h-1 w-full bg-white/20 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${isActive ? currentProgress : episode.progress}%`
                                                        }}
                                                    ></div>
                                                </div>

                                                {/* Swipe indicators */}
                                                <div className="mt-4 flex justify-between">
                                                    <div className="flex items-center text-xs text-white/60">
                                                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                                        </svg>
                                                        Swipe
                                                    </div>
                                                    {series.episodes.length > 1 && series.currentEpisodeIndex < series.episodes.length - 1 && (
                                                        <div className="flex items-center text-xs text-white/60">
                                                            <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                            </svg>
                                                            Next episode
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Mobile view - fullscreen reel */}
                    {isMobileView && activeSeries && activeEpisode && (
                        <div className="relative w-full h-screen">
                            <div className="absolute inset-0">
                                {/* Video player */}
                                <VideoPlayer
                                    src={activeEpisode.videoSrc}
                                    isPlaying={isPlaying}
                                    playbackSpeed={playbackSpeed}
                                    onTimeUpdate={handleVideoProgress}
                                    onEnded={handleVideoEnd}
                                    className={`h-full w-full object-cover transition-transform duration-300 ${transitioning ? 'scale-110' : 'scale-100'
                                        }`}
                                    poster={activeEpisode.imageSrc}
                                    autoplay={true}
                                />

                                {/* Gradient overlays */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none"></div>

                                {/* Tap to pause/play */}
                                <div
                                    className="absolute inset-0 z-10"
                                    onClick={handlePlay}
                                >
                                    {/* Center play icon - only show when paused */}
                                    {!isPlaying && (
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            <div className="w-20 h-20 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                                                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Topic indicator (top) */}
                                <div className="absolute top-16 left-0 right-0 flex justify-center">
                                    <div className="px-4 py-1 bg-black/40 backdrop-blur-sm rounded-full flex items-center space-x-2">
                                        <span className="text-[#37E8FF]">{activeSeries.title}</span>
                                        <span className="text-white/30">•</span>
                                        <span className="text-white/70">EP {activeSeries.currentEpisodeIndex + 1}/{activeSeries.episodes.length}</span>
                                    </div>
                                </div>

                                {/* Episode navigation indicators */}
                                {activeSeries.currentEpisodeIndex < activeSeries.episodes.length - 1 && (
                                    <div className="absolute top-28 left-0 right-0 flex justify-center">
                                        <div className="text-xs text-white/50 flex items-center">
                                            <svg className="w-3 h-3 mr-1 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                            </svg>
                                            Swipe up for next episode
                                        </div>
                                    </div>
                                )}

                                {activeSeries.currentEpisodeIndex > 0 && (
                                    <div className="absolute bottom-20 left-0 right-0 flex justify-center">
                                        <div className="text-xs text-white/50 flex items-center">
                                            <svg className="w-3 h-3 mr-1 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                            </svg>
                                            Swipe down for previous episode
                                        </div>
                                    </div>
                                )}

                                {/* Right side action buttons */}
                                <div className="absolute right-3 bottom-32 flex flex-col items-center space-y-6 z-20">
                                    {/* Like button */}
                                    <button
                                        onClick={() => handleLike(activeSeries.id, activeEpisode.id)}
                                        className="flex flex-col items-center"
                                    >
                                        <div className={`w-12 h-12 rounded-full ${userLikes[`${activeSeries.id}-${activeEpisode.id}`] ? 'bg-[#FF3D8A]/30' : 'bg-black/40'} backdrop-blur-sm flex items-center justify-center transform transition-transform active:scale-90`}>
                                            <svg className={`w-6 h-6 ${userLikes[`${activeSeries.id}-${activeEpisode.id}`] ? 'text-[#FF3D8A]' : 'text-white'}`} fill={userLikes[`${activeSeries.id}-${activeEpisode.id}`] ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs mt-1">{formatNumber(activeEpisode.likes + (userLikes[`${activeSeries.id}-${activeEpisode.id}`] ? 1 : 0))}</span>
                                    </button>

                                    {/* Comment button */}
                                    <button className="flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transform transition-transform active:scale-90">
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs mt-1">Comment</span>
                                    </button>

                                    {/* Save button */}
                                    <button
                                        onClick={() => handleSave(activeSeries.id, activeEpisode.id)}
                                        className="flex flex-col items-center"
                                    >
                                        <div className={`w-12 h-12 rounded-full ${userSaves[`${activeSeries.id}-${activeEpisode.id}`] ? 'bg-[#37E8FF]/30' : 'bg-black/40'} backdrop-blur-sm flex items-center justify-center transform transition-transform active:scale-90`}>
                                            <svg className={`w-6 h-6 ${userSaves[`${activeSeries.id}-${activeEpisode.id}`] ? 'text-[#37E8FF]' : 'text-white'}`} fill={userSaves[`${activeSeries.id}-${activeEpisode.id}`] ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs mt-1">Save</span>
                                    </button>

                                    {/* Speed control */}
                                    <button
                                        onClick={handleSpeedChange}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center transform transition-transform active:scale-90">
                                            <span className="text-white font-medium">{playbackSpeed}x</span>
                                        </div>
                                        <span className="text-xs mt-1">Speed</span>
                                    </button>
                                </div>

                                {/* Content info - bottom */}
                                {showInfo && (
                                    <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                                        <button
                                            onClick={toggleInfo}
                                            className="absolute top-0 right-4 p-2"
                                        >
                                            <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>

                                        <div className="mb-2">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className="w-10 h-10 rounded-full bg-[#37E8FF]/20 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="font-medium">{activeEpisode.channelName}</div>
                                                    <div className="text-xs text-white/70">{formatNumber(activeEpisode.views)} views</div>
                                                </div>

                                                <Link
                                                    href={`/channels/${activeEpisode.channelId}`}
                                                    className="ml-auto text-sm bg-white/10 px-2 py-1 rounded"
                                                >
                                                    Follow
                                                </Link>
                                            </div>

                                            <h3 className="font-bold text-lg text-white">
                                                {activeSeries.title}: {activeEpisode.title}
                                            </h3>

                                            <p className="text-sm text-white/80 mt-2 line-clamp-2">
                                                {activeEpisode.description}
                                            </p>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] rounded-full"
                                                style={{ width: `${currentProgress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Info button - only when info is hidden */}
                                {!showInfo && (
                                    <button
                                        onClick={toggleInfo}
                                        className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center z-20 transform transition-transform active:scale-90"
                                    >
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation buttons - desktop view */}
                    {!isMobileView && activeSeries && (
                        <div className="fixed bottom-10 left-0 right-0 flex justify-center items-center space-x-8 z-20">
                            {/* Previous button */}
                            <button
                                onClick={activeSeries.currentEpisodeIndex > 0 ? handleSwipeDown : handleSwipeRight}
                                className="control-btn w-12 h-12 rounded-full flex items-center justify-center border border-[#A742FF]/30 bg-[#121218]/70 transform transition-transform hover:scale-105 active:scale-95"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#A742FF]/20 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#A742FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </div>
                            </button>

                            {/* Play button */}
                            <button
                                onClick={handlePlay}
                                className="control-btn w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] p-[2px] transform transition-transform hover:scale-105 active:scale-95"
                            >
                                <div className="w-full h-full rounded-full bg-[#121218] flex items-center justify-center">
                                    {isPlaying ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m-9-6h18" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                </div>
                            </button>

                            {/* Next button */}
                            <button
                                onClick={activeSeries.currentEpisodeIndex < activeSeries.episodes.length - 1 ? handleSwipeUp : handleSwipeLeft}
                                className="control-btn w-12 h-12 rounded-full flex items-center justify-center border border-[#37E8FF]/30 bg-[#121218]/70 transform transition-transform hover:scale-105 active:scale-95"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#37E8FF]/20 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    )}

                    {/* Episode navigation dots - desktop */}
                    {!isMobileView && activeSeries && activeSeries.episodes.length > 1 && (
                        <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-20 flex flex-col items-center space-y-2">
                            {activeSeries.episodes.map((episode, idx) => (
                                <div
                                    key={episode.id}
                                    className={`w-2 h-2 rounded-full cursor-pointer transition-all ${idx === activeSeries.currentEpisodeIndex ? 'bg-[#37E8FF] scale-150' : 'bg-white/40 hover:bg-white/60'}`}
                                    onClick={() => {
                                        if (idx !== activeSeries.currentEpisodeIndex) {
                                            const newSeriesData = [...seriesData];
                                            newSeriesData[activeIndex].currentEpisodeIndex = idx;
                                            setSeriesData(newSeriesData);
                                            setCurrentProgress(0);
                                        }
                                    }}
                                    title={`Episode ${idx + 1}: ${episode.title}`}
                                ></div>
                            ))}
                        </div>
                    )}

                    {/* Topic navigation dots - desktop */}
                    {!isMobileView && (
                        <div className="fixed bottom-2 left-0 right-0 flex justify-center items-center space-x-2 z-20 mb-4">
                            {seriesData.map((series, idx) => (
                                <div
                                    key={series.id}
                                    className={`w-2 h-2 rounded-full cursor-pointer transition-all ${idx === activeIndex ? 'bg-[#FF3D8A] scale-150' : 'bg-white/40 hover:bg-white/60'}`}
                                    onClick={() => setActiveIndex(idx)}
                                    title={series.title}
                                ></div>
                            ))}
                        </div>
                    )}
                </div>
            </IntegratedNavigationSystem>

            {/* Fullscreen content view */}
            {showFullContent && !isMobileView && activeSeries && activeEpisode && (
                <div className="fixed inset-0 bg-[#121218] z-50 flex flex-col">
                    {/* Header */}
                    <div className="p-4 flex justify-between items-center bg-gradient-to-b from-[#121218] to-transparent">
                        <button
                            onClick={() => setShowFullContent(false)}
                            className="text-white/70 hover:text-white transform transition-transform hover:scale-105 active:scale-95"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="text-white/70">
                            {activeSeries.title} • Episode {activeSeries.currentEpisodeIndex + 1}
                        </div>
                    </div>

                    {/* Video content */}
                    <div className="relative w-full h-72 md:h-96">
                        <VideoPlayer
                            src={activeEpisode.videoSrc}
                            isPlaying={true}
                            playbackSpeed={playbackSpeed}
                            className="h-full w-full object-cover"
                            controls={true}
                            autoplay={true}
                        />
                    </div>

                    {/* Text content */}
                    <div className="p-6 overflow-y-auto flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-[#37E8FF]/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-lg font-medium">{activeEpisode.channelName}</div>
                                <div className="text-sm text-white/70">{formatNumber(activeEpisode.views)} views</div>
                            </div>

                            <Link
                                href={`/channels/${activeEpisode.channelId}`}
                                className="ml-auto bg-[#37E8FF] text-[#121218] px-4 py-2 rounded-lg font-medium transition-transform transform hover:scale-105 active:scale-95"
                            >
                                Follow Channel
                            </Link>
                        </div>

                        <h1 className="text-2xl font-bold mb-2">{activeEpisode.title}</h1>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-white/80">{activeEpisode.description}</p>
                        </div>

                        {isConnected && (
                            <div className="mt-8 p-4 bg-[#1A1A24] rounded-lg">
                                <h3 className="font-medium mb-2">Channel Ownership</h3>
                                <p className="text-sm text-white/70 mb-4">
                                    You own 0% of this channel. Purchase shares to earn from this content.
                                </p>
                                <Link
                                    href={`/marketplace?channel=${activeEpisode.channelId}`}
                                    className="block w-full py-2 text-center bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] rounded-lg text-white transition-transform transform hover:scale-102 active:scale-98"
                                >
                                    View in Marketplace
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}