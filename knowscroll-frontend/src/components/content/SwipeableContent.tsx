"use client";

import { useEffect, useState } from 'react';
import { useSwipe } from '@/hooks/useSwipe';
import Image from 'next/image';

// Define the content type
export type ContentItem = {
    id: number;
    title: string;
    body: string;
    channelName: string;
    seriesTitle: string;
    episodeNumber: number;
    totalEpisodes: number;
    channelId?: number;
    imageSrc: string;
    progress: number;
};

interface SwipeableContentProps {
    content: ContentItem;
    onSwipeUp: () => void;
    onSwipeDown: () => void;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
}

export default function SwipeableContent({
    content,
    onSwipeUp,
    onSwipeDown,
    onSwipeLeft,
    onSwipeRight
}: SwipeableContentProps) {
    const [swipeAnimation, setSwipeAnimation] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Reset animation when content changes
    useEffect(() => {
        setSwipeAnimation(null);
    }, [content]);

    // Custom hook for detecting swipe gestures
    useSwipe({
        onSwipeUp: () => {
            setSwipeAnimation('slide-up');
            setTimeout(() => {
                onSwipeUp();
                setIsFullscreen(true);
            }, 300);
        },
        onSwipeDown: () => {
            setSwipeAnimation('slide-down');
            setTimeout(() => {
                onSwipeDown();
            }, 300);
        },
        onSwipeLeft: () => {
            setSwipeAnimation('slide-left');
            setTimeout(() => {
                onSwipeLeft();
            }, 300);
        },
        onSwipeRight: () => {
            setSwipeAnimation('slide-right');
            setTimeout(() => {
                onSwipeRight();
            }, 300);
        }
    });

    return (
        <div
            className={`w-full h-full touch-none ${swipeAnimation ? `animate-${swipeAnimation}` : ''}`}
        >
            <div className="relative h-full w-full bg-[#121218] overflow-hidden">
                {/* Content card */}
                <div className="content-card w-full h-[85%] mx-auto my-auto overflow-hidden">
                    {/* Background image */}
                    <div className="relative h-full w-full">
                        <Image
                            src={content.imageSrc || "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=500"}
                            alt={content.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="brightness-[0.8]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#121218]/40 to-[#121218]"></div>
                    </div>

                    {/* Content overlay */}
                    <div className="absolute inset-0 flex flex-col">
                        {/* Top info */}
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-2xl font-bold">{content.title}</h2>
                            </div>
                            <div className="flex text-sm text-[#37E8FF] mb-8">
                                {content.channelName} • Episode {content.episodeNumber}/{content.totalEpisodes}
                            </div>
                        </div>

                        {/* Main content */}
                        <div className="flex-1 px-6 overflow-y-auto">
                            <div className="prose prose-invert max-w-none">
                                <p>{content.body}</p>
                            </div>
                        </div>

                        {/* Bottom info and progress */}
                        <div className="p-6">
                            <div className="progress-bar">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${content.progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation hints */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 opacity-70">
                    <div className="self-center">
                        <div className="text-sm bg-[#121218]/80 px-3 py-1 rounded-full border border-[#37E8FF]/30 text-[#37E8FF]">
                            ↑ Continue series
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-sm bg-[#121218]/80 px-3 py-1 rounded-full border border-[#A742FF]/30 text-[#A742FF]">
                            ← New topic
                        </div>
                        <div className="text-sm bg-[#121218]/80 px-3 py-1 rounded-full border border-[#FF3D8A]/30 text-[#FF3D8A]">
                            New topic →
                        </div>
                    </div>
                    <div className="self-center">
                        <div className="text-sm bg-[#121218]/80 px-3 py-1 rounded-full border border-[#37E8FF]/30 text-[#37E8FF]">
                            ↓ Previous in series
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}