"use client";

import { motion, useMotionValue, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSwipe } from '@/hooks/useSwipe';

// Define the content type
export type ContentItem = {
    id: number;
    title: string;
    body: string;
    channelName: string;
    seriesIndex: number;
    seriesLength: number;
    channelId?: number;
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
    const controls = useAnimation();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [direction, setDirection] = useState<string | null>(null);

    // Reset animation when content changes
    useEffect(() => {
        controls.start({ x: 0, y: 0, opacity: 1 });
    }, [content, controls]);

    // Custom hook for detecting swipe gestures
    useSwipe({
        onSwipeUp: () => {
            setDirection('up');
            controls.start({ y: -window.innerHeight, opacity: 0 });
            setTimeout(onSwipeUp, 300);
        },
        onSwipeDown: () => {
            setDirection('down');
            controls.start({ y: window.innerHeight, opacity: 0 });
            setTimeout(onSwipeDown, 300);
        },
        onSwipeLeft: () => {
            setDirection('left');
            controls.start({ x: -window.innerWidth, opacity: 0 });
            setTimeout(onSwipeLeft, 300);
        },
        onSwipeRight: () => {
            setDirection('right');
            controls.start({ x: window.innerWidth, opacity: 0 });
            setTimeout(onSwipeRight, 300);
        }
    });

    return (
        <motion.div
            className="w-full h-full touch-none"
            style={{ x, y }}
            animate={controls}
            transition={{ type: "spring", damping: 30 }}
        >
            <div className="relative w-full h-full bg-white rounded-lg shadow-md overflow-hidden">
                {/* Content display */}
                <div className="p-6 h-full overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
                    <div className="mb-4 text-sm text-blue-600">
                        {content.channelName} • Part {content.seriesIndex} of {content.seriesLength}
                    </div>
                    <div className="prose max-w-none">{content.body}</div>
                </div>

                {/* Navigation hints */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 opacity-50">
                    <div className="self-center">
                        <span className="text-sm bg-white/80 px-2 py-1 rounded">↑ Continue series</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm bg-white/80 px-2 py-1 rounded">← New topic</span>
                        <span className="text-sm bg-white/80 px-2 py-1 rounded">New topic →</span>
                    </div>
                    <div className="self-center">
                        <span className="text-sm bg-white/80 px-2 py-1 rounded">↓ Previous in series</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}