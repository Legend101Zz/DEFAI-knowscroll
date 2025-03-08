"use client";

import { useState} from 'react';
import { useWallet } from '@/context/WalletContext';
import Link from 'next/link';
import Image from 'next/image';

// Types for our content
type Series = {
    id: string;
    title: string;
    category: string;
    episodes: Episode[];
    currentEpisode: number;
};

type Episode = {
    id: number;
    title: string;
    description: string;
    progress: number; // 0-100
    imageSrc: string;
    channelId: number;
    channelName: string;
};

export default function ExplorePage() {
    const { isConnected } = useWallet();
    const [activeIndex, setActiveIndex] = useState(1); // Center card is active
    const [isPlaying, setIsPlaying] = useState(false);

    // Sample data - this would come from your API or blockchain in production
    const seriesData: Series[] = [
        {
            id: "technology",
            title: "Technology",
            category: "Future Tech",
            currentEpisode: 5,
            episodes: [
                {
                    id: 1,
                    title: "Space Tech",
                    description: "The origins of space technology can be traced back...",
                    progress: 65,
                    imageSrc: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=500",
                    channelId: 1,
                    channelName: "Tech Channel"
                }
            ]
        },
        {
            id: "worldwar2",
            title: "World War 2",
            category: "History",
            currentEpisode: 3,
            episodes: [
                {
                    id: 1,
                    title: "Origins of WWII",
                    description: "The origins of World War II can be traced back to the harsh Treaty of Versailles...",
                    progress: 50,
                    imageSrc: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=500",
                    channelId: 2,
                    channelName: "History Channel"
                }
            ]
        },
        {
            id: "space",
            title: "Space Exploration",
            category: "History",
            currentEpisode: 4,
            episodes: [
                {
                    id: 1,
                    title: "Space Race",
                    description: "The Space Race was a competition between the US and USSR...",
                    progress: 80,
                    imageSrc: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=500",
                    channelId: 3,
                    channelName: "Space Channel"
                }
            ]
        }
    ];

    const handlePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const navigateNext = () => {
        setActiveIndex((prev) => (prev === 2 ? 0 : prev + 1));
    };

    const navigatePrev = () => {
        setActiveIndex((prev) => (prev === 0 ? 2 : prev - 1));
    };

    return (
        <div className="min-h-screen bg-[#121218] text-white">
            {/* Top navigation bar */}
            <div className="p-4 pt-8">
                <h1 className="text-xl font-bold text-center mb-2">Multi-Directional Swipe</h1>
                <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-[#37E8FF]">Swipe Up/Down</div>
                    <div className="h-[2px] flex-1 mx-4 bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A]">
                        <div className="h-full w-1/3 bg-white rounded-full"></div>
                    </div>
                    <div className="text-sm text-[#FF3D8A]">Swipe Left/Right</div>
                </div>
            </div>

            {/* Main content area */}
            <div className="relative px-4">
                {/* Cards container */}
                <div className="flex justify-between space-x-3 mb-8">
                    {seriesData.map((series, index) => {
                        const episode = series.episodes[0]; // Get first episode of series
                        return (
                            <div
                                key={series.id}
                                className={`content-card flex-1 relative ${index === activeIndex ? 'scale-100 opacity-100 z-10' : 'scale-90 opacity-70'
                                    } transition-all duration-300`}
                            >
                                {/* Card image */}
                                <div className="relative h-[340px] w-full overflow-hidden">
                                    <Image
                                        src={episode.imageSrc}
                                        alt={episode.title}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        className="brightness-75"
                                    />
                                </div>

                                {/* Card content */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                                    <h3 className="font-bold text-lg">{series.title}</h3>
                                    <p className="text-sm">{episode.title}</p>
                                    <p className="text-xs text-gray-300">Episode {series.currentEpisode}</p>

                                    {/* Swipe direction */}
                                    <div className={`mt-2 text-sm ${index === 0 ? 'text-[#A742FF]' :
                                        index === 1 ? 'text-[#37E8FF]' : 'text-[#FF3D8A]'
                                        }`}>
                                        {index === 0 ? 'Swipe Up' :
                                            index === 1 ? 'Swipe Right' : 'Browse more...'}
                                    </div>

                                    {/* Progress bar */}
                                    <div className="progress-bar mt-2">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${episode.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Controls area */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#121218] to-transparent pb-12">
                    {/* Navigation controls */}
                    <div className="flex justify-between items-center mb-8">
                        {/* Previous button */}
                        <button
                            onClick={navigatePrev}
                            className="control-btn w-12 h-12 rounded-full flex items-center justify-center border border-[#A742FF]/30 bg-[#121218]/70"
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
                            className="control-btn w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-[#37E8FF] to-[#FF3D8A] p-[2px]"
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
                            onClick={navigateNext}
                            className="control-btn w-12 h-12 rounded-full flex items-center justify-center border border-[#37E8FF]/30 bg-[#121218]/70"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#37E8FF]/20 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    </div>

                    {/* Bottom controls */}
                    <div className="flex justify-between items-center">
                        <button className="control-btn rounded-full w-10 h-10 bg-[#FF3D8A]/20 border border-[#FF3D8A]/30 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF3D8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14V3" />
                            </svg>
                        </button>

                        <button className="control-btn rounded-full w-8 h-8 bg-white/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>

                        <button className="control-btn rounded-full w-8 h-8 flex items-center justify-center bg-white/10 text-white text-xs font-bold">
                            30
                        </button>

                        <button className="control-btn rounded-full w-10 h-10 bg-[#37E8FF]/20 border border-[#37E8FF]/30 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#37E8FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}